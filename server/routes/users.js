let router = require('koa-router')()
let bcrypt = require('bcrypt-nodejs')
let Multi = require('../multifactor.js')

const getUserById = async (ctx, user_id) => {
	let userRows, user
	const values = [user_id]
	userRows = await ctx.db.query(`SELECT * FROM users WHERE user_id = $1;`, values)
	user = userRows.rows[0]
	return user
}
exports.getUserById = getUserById

const getUserByEmail = async (ctx, email) => {
	let userRows, user
	if(!email && ctx.request.body.email) email = ctx.request.body.email
	const values = [email]
	userRows = await ctx.db.query(`SELECT * FROM users WHERE email = $1;`, values)
	user = userRows.rows[0]
	return user
}
exports.getUserByEmail = getUserByEmail

const createUser = async (ctx, password) => {
	let userRows, user
	let bcryptPass
	if(!password && ctx.request.body.password) password = ctx.request.body.password
	bcryptPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
	const values = [ctx.request.body.user_name, ctx.request.body.email, bcryptPass, ctx.request.body.isLandlord]
	userRows = await ctx.db.query(`INSERT INTO users (user_name, email, user_password, is_landlord) VALUES ($1, $2, $3, $4) RETURNING *;`, values)
	user = userRows.rows[0]
	return user
}
exports.createUser = createUser

const checkUserPass = async (ctx, email, password, user) => {
	let userRows, passwordCheck, storedPassword

	//get user and get stored password
	if(!user) {
		if(!email && ctx.request.body.email) email = ctx.request.body.email
		if(!password && ctx.request.body.password) password = ctx.request.body.password
		const values = [email]
		userRows = await ctx.db.query(`SELECT user_password FROM users WHERE email = $1;`, values)
		storedPassword = userRows.rows[0].user_password
	} else {
		storedPassword = user.user_password
	}

	passwordCheck = await bcrypt.compareSync(password, storedPassword)

	return passwordCheck

}
exports.checkUserPass = checkUserPass

const updateMerchant = async (ctx, user_id) => {
	let user, userRows
	const values = [ctx.request.body.merchant_id, user_id]
	userRows = await ctx.db.query(`UPDATE users SET (merchant_id, payment_set_up) = ($1, true) WHERE user_id = $2 RETURNING *;`, values)
	user = userRows.rows[0]
	return user
}
exports.updateMerchant = updateMerchant

router
	.get('/:id', async (ctx, next) => {
		let user
		user = await getUserById(ctx, ctx.params.id)
		if(user) {
			ctx.response.status = 302

		}
		ctx.body = user
	})
	.put('/:id', async (ctx, next) => {
		// ctx.request.body  {user_name, email, user_password, new_password, creditcard}
		let user, userRows, req, query, values, count, match, updateAtts
		const val = [ctx.params.id]
		user = await ctx.db.query(`SELECT * FROM users where user_id = $1;`, val)
		user = user.rows[0]
		//if user found with this id
		if(user) {
			//check password
			match = true
			if(ctx.request.body.user_password) match = await checkUserPass(ctx, null, ctx.request.body.user_password, user)
				//if password checks out, set new fields on user object
			if(match) {
				//change this user object to have new fields
				for(let attr in ctx.request.body) {
					if(user[attr] !== undefined && attr !== 'user_password') user[attr] = ctx.request.body[attr]
				}
				if(ctx.request.body.new_password) user.user_password = bcrypt.hashSync(ctx.request.body.new_password, bcrypt.genSaltSync(10))
				query = `UPDATE users SET (`
				values = `(`
				updateAtts = []
				count = 0
				for(let attr in ctx.request.body){
					if(user[attr] !== undefined){
						count++
						query += `${attr}, `
						updateAtts.push(user[attr])
						values += '$' + count + ', '
					}
				}
				query = query.substring(0, query.length - 2) //kill the last comma and space
				values = values.substring(0,values.length - 2) //kill the last comma and space
				query = query + `) = ` + values + `) WHERE user_id = ${ctx.params.id} RETURNING *;`
				userRows = await ctx.db.query(query, updateAtts)
				user = userRows.rows[0]

				ctx.response.status = 201
				ctx.body = {user: user}

				//if user is a tenant, update the emails of all tenants pointing to this user
				if(!user.is_landlord) {
					const values3 = [user.email, user.user_id]
					let tenant = await ctx.db.query(`UPDATE tenants SET (tenant_email) = ($1) WHERE user_id = $2 AND is_active = true RETURNING *;`, values3)
					ctx.body.tenant = tenant.rows[0]
					ctx.body.tenant.user_name = user.user_name
				}
			} else { //password did not match
				ctx.response.status = 401
				ctx.body = 'Password check failed, unauthorized to change profile data'
			}
		} else {
			ctx.response.status = 400
			ctx.body = 'No user found'
		}
	})
	.get('/', async (ctx, next) => {
		let userRows
		userRows = await ctx.db.query(`SELECT * FROM users;`)
		ctx.body = userRows.rows
	})
	.post('/', async (ctx, next) => {
		// ctx.request.body = {user_name, email, user_password, isLandlord}
		let user
		if(await getUserByEmail(ctx, ctx.request.body.email)) {
			ctx.response.status = 418
			ctx.body = 'User exists'
		} else {
			user = await createUser(ctx)
			if(user) {
				ctx.response.status = 201
				ctx.body = user
			} else {
				ctx.response.status = 400
				ctx.body = 'Problem creating user'
			}
		}
	})
	.get('/email/:email', async (ctx, next) => {
		let user
		user = await getUserByEmail(ctx, ctx.params.email)
		if(user){
			ctx.response.status = 302
			ctx.body = user
		} else {
			ctx.response.status = 404
			ctx.body = `No user found with that email`
		}
	})
	.get('/multiset/:user_id', async (ctx, next) => {
		let user
		user = await Multi.genUserMulti(ctx, ctx.params.user_id)
		if(user){
			ctx.response.status = 200
			ctx.body = user
		} else {
			ctx.response.status = 400
			ctx.body = 'Problem modifying multiauth'
		}
	})
	.get('/multiremove/:user_id', async (ctx, next) => {
		let user
		user = await Multi.removeUserMulti(ctx, ctx.params.user_id)
		if(user){
			ctx.response.status = 200
			ctx.body = user
		} else {
			ctx.response.status = 400
			ctx.body = 'Problem removing multiauth'
		}
	})
	exports.routes = router

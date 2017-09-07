let router = require('koa-router')()
let bcrypt = require('bcrypt-nodejs')

//responds to /users, /users/:email

const getUserById = async (ctx, user_id) => {
	if(!ctx.db) return 'failure'
	let userRows, user
	userRows = await ctx.db.query(`SELECT * FROM users WHERE user_id = ${user_id};`)
	user = userRows.rows[0]
	return user
}
exports.getUserById = getUserById

const getUserByEmail = async (ctx, email) => {
	let userRows, user
	if(!email && ctx.request.body.email) email = ctx.request.body.email
	userRows = await ctx.db.query(`SELECT * FROM users WHERE email = '${email}';`)
	user = userRows.rows[0]
	return user
}
exports.getUserByEmail = getUserByEmail

const createUser = async (ctx, password) => {
	//ctx.request.body = {user_name, email, user_password, isLandlord}
	let userRows, user
	let bcryptPass
	if(!password && ctx.request.body.password) password = ctx.request.body.password
	bcryptPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
	userRows = await ctx.db.query(`INSERT INTO users (user_name, email, user_password, is_landlord) VALUES ('${ctx.request.body.user_name}', '${ctx.request.body.email}', '${bcryptPass}', ${ctx.request.body.isLandlord}) RETURNING *;`)
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
		userRows = await ctx.db.query(`SELECT user_password FROM users WHERE email = '${email}';`)
		storedPassword = userRows.rows[0].user_password
	} else {
		storedPassword = user.user_password
	}

	passwordCheck = await bcrypt.compareSync(password, storedPassword)

	return passwordCheck

}
exports.checkUserPass = checkUserPass

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
		// ==================   user_password IS A REQUIRED CONTEXT FIELD
		// ctx.request.body  {user_name, email, user_password, new_password, creditcard}
		let user, userRows, req, query, values, count, match
		console.log('ctx', ctx.request.body)
		user = await ctx.db.query(`SELECT * FROM users where user_id = ${ctx.params.id};`)
		user = user.rows[0]
		//if user found with this id
		if(user && ctx.request.body.user_password) {
			//check password
			match = await checkUserPass(ctx, null, ctx.request.body.user_password, user)
				//if password checks out, set new fields on user object
			if(match) {
				//change this user object to have new fields
				for(let attr in ctx.request.body) {
					if(user[attr] !== undefined && attr !== 'user_password') user[attr] = ctx.request.body[attr]
				}
				if(ctx.request.body.new_password) user.user_password = bcrypt.hashSync(ctx.request.body.new_password, bcrypt.genSaltSync(10))
				query = `UPDATE users SET (`
				values = `(`
				for(let attr in ctx.request.body){
					if(user[attr] !== undefined){
						count++
						query += `${attr}, `
						values += `'${user[attr]}', `
					}
				}
				query = query.substring(0, query.length - 2) //kill the last comma and space
				values = values.substring(0,values.length - 2) //kill the last comma and space
				query = query + `) =` + values + `) WHERE user_id = ${ctx.params.id} RETURNING *;`
				console.log(query)
				userRows = await ctx.db.query(query)
				// userRows = await ctx.db.query(`UPDATE users SET (user_name, email, user_password, creditcard) = ('${req.user_name}', '${req.email}', '${req.user_password}', '${req.creditcard}') WHERE user_id = ${ctx.params.id} RETURNING *;`)
				user = userRows.rows[0]

				ctx.response.status = 201
				ctx.body = {user: user}

				//if user is a tenant, update the emails of all tenants pointing to this user
				if(!user.is_landlord) {
					let tenant = await ctx.db.query(`UPDATE tenants SET (tenant_email) = ('${user.email}') WHERE user_id = ${user.user_id} AND is_active = true RETURNING *;`)
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
	exports.routes = router

	// module.exports = {
	// 	routes: router,
	// 	getUserByEmail: getUserByEmail,
	// 	createUser: createUser,
	// 	getUserById: getUserById,
	// }
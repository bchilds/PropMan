let router = require('koa-router')()
let bcrypt = require('bcrypt-nodejs')
//responds to /users, /users/:email

const getUserById = async (ctx, user_id) => {
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

const checkUserPass = async (ctx, email, password) => {
	let userRows, user
	let passwordCheck
	if(!email && ctx.request.body.email) email = ctx.request.body.email
	if(!password && ctx.request.body.password) password = ctx.request.body.password
	userRows = await ctx.db.query(`SELECT user_password FROM users WHERE email = '${email}';`)
	let storedPassword = userRows.rows[0].user_password
	passwordCheck = bcrypt.compareSync(password, storedPassword)

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
		// ctx.request.body  {user_name, email, user_password, creditcard}
		let userRows, req
		req = ctx.request.body
		userRows = await ctx.db.query(`UPDATE users SET (user_name, email, user_password, creditcard) = ('${req.user_name}', '${req.email}', '${req.user_password}', '${req.creditcard}') WHERE user_id = ${ctx.params.id} RETURNING *;`)
		ctx.body = userRows.rows[0]
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
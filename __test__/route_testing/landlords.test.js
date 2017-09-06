
//server setup
const { Pool, Client } = require('pg')
const bodyParser = require('koa-bodyparser');

let db, landlord, ctx, user, server, request
db = new Pool()
let supertest = require('supertest')
let app = require('../setup.js')
app.context.db = db


// use router
let Landlords = require('../../server/routes/landlords.js')
let api = require('koa-router')()
app.use(bodyParser())
api.use('/api/landlords', Landlords.routes.routes())
app
	.use(api.routes())
	.use(api.allowedMethods())


beforeAll( async () => {
	server = app.listen()
	request = supertest(server)

	let testUser = {
		user_name: 'Bob The Tester',
		email: 'jest@test.com',
		user_password: '123',
		isLandlord: true
	}
	//clear test users
	await db.query(`DELETE FROM users WHERE email = '${testUser.email}';`)

	//set test user
	user = await db.query(`INSERT INTO users (user_name, email, user_password, is_landlord) VALUES ('${testUser.user_name}', '${testUser.email}', '${testUser.password}', ${testUser.isLandlord}) RETURNING *;`)
	user = user.rows[0]
	ctx = {request: {}}
	ctx.request.body = {
		user: user
	}
	ctx.db = db
})

afterAll( async () => {
	await db.query(`DELETE FROM users WHERE email = '${user.email}';`)
	await db.query(`DELETE FROM landlords WHERE landlord_id = ${landlord.landlord_id}`)
	db.end()
	server.close()
})

test(`Can create landlord`, async () => {
	let result = await request.post(`/api/landlords`).send(ctx.request.body)
	landlord = result.body
	expect(result.status).toBe(201)
	expect(landlord.user_id).toBe(user.user_id)
})

test(`Can retrieve landlord by user_id`, async () => {
	let result = await request.get(`/api/landlords/${landlord.user_id}`)
	landlord = result.body
	expect(result.status).toBe(302)
	expect(landlord.user_id).toBe(user.user_id)
})

test(`Can retrieve landlord data`, async () => {
	let result, data
	result = await request.post(`/api/landlords/data`).send(ctx.request.body)
	data = result.body
	expect(result.status).toBe(302)
})

//get all tenants at a property
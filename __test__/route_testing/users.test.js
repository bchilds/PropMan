let Users = require('../../server/routes/users.js')
const { Pool, Client } = require('pg')
let db, user, ctx
db = new Pool()


//server setup
let supertest = require('supertest')
let app = require('../setup.js')
app.context.db = db
// use router
let api = require('koa-router')()
api.use('/api/users', Users.routes.routes())
app
	.use(api.routes())
	.use(api.allowedMethods())
	
const request = supertest.agent(app.listen())

beforeAll( async () => {
	ctx = {request: {}}
	ctx.request.body = {
		user_name: 'Bob The Tester',
		email: 'jest@test.com',
		user_password: '123',
		isLandlord: true
	}
	ctx.db = db
	await db.query(`DELETE FROM users WHERE email = '${ctx.request.body.email}';`)
})

afterAll( async () => {
  await db.end()
  await app.close()
})

afterEach( () => {
	if(user) db.query(`DELETE FROM users WHERE user_id = ${user.user_id};`)
})

test(`user is created`, async () => {
	user = await Users.createUser(ctx)

	//expect user to exist
	expect(user).toBeTruthy
})

test(`user can be found by id`, async () => {
	user = await Users.createUser(ctx)
	let result
	result = await request.get(`/api/users/${user.user_id}`)
	expect(result.body.user_id).toBe(user.user_id)
})

test(`user can be found by email`, async () => {
	user = await Users.createUser(ctx)
	let result
	result = await request.get(`/api/users/email/${ctx.request.body.email}`)
	expect(result.body.email).toBe(user.email)
})

test(`user can be created with post`, async () => {
	let result
	result = await request.post(`/api/users`).send(ctx.request.body)
	user = result.body
	// console.log(result)
	expect(result.status).toBe(201)
	expect(result.body.email).toEqual(ctx.request.body.email)
})
	
test(`user can be updated with put`, async () => {
	user = await Users.createUser(ctx)
	let result
	let copy = user
	user.user_password = '5678'
	result = await request.put(`/api/users/${user.user_id}`).send(copy)
	expect(result.body.user_password).toBe('5678')
})


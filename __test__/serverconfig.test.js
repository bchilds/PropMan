let app = require('./setup.js')
// const { Pool, Client } = require('pg')
// const bodyParser = require('koa-bodyparser');
let supertest = require('supertest')
let request, server, db
// db = new Pool()
// app.context.db = db

// app.use(bodyParser())

// server.use( async ctx => {
// 	ctx.body = 'Hello, world'
// })

beforeAll( () => {
	app.use( async ctx => {
		ctx.body = 'Hello, world'
	})

	server = app.listen()
	request = supertest(server)
})

afterAll( () => {
	server.close()
})


test('return hello world', async () => {
	let thing = await request.get('/')
	expect(thing.text).toBe('Hello, world')
})
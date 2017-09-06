
// server setup
let { Pool } = require('pg')
let supertest = require('supertest')
let app = require('./setup.js')

let db, ctx, server, request
db = new Pool()
app.context.db = db


// use router
let multifactor = require('../server/multifactor.js')
// let api = require('koa-router')()
// app.use(bodyParser())
// api.use('/api/docs', Docs.routes.routes())
// app
// 	.use(api.routes())
// 	.use(api.allowedMethods())

beforeAll( async () => {
	server = app.listen()
	request = supertest(server)

	ctx = {request: {}}
	ctx.db = db
})


afterAll( async () => {
  db.end()
  server.close()
})

//test basic functionality
test(`Get a secret key, generate a token validate it`, async () => {
	let secret = await multifactor.genSecretKey()
	// console.log(secret)
	let token = await multifactor.genTimeToken(null, secret)
	expect(await multifactor.validateToken(null, token, secret)).toBe(true)
})
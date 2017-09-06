require('dotenv').config()
const Koa = require('koa')
const bodyParser = require('koa-bodyparser');
const { Pool, Client } = require('pg')
// let supertest = require('supertest')

let app = new Koa()
app.use(bodyParser())
let server, request, db
db = new Pool()
app.context.db = db

app.use( async ctx => {
	ctx.body = 'Hello, world'
})

server = app.listen()

module.exports = server
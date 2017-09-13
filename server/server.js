require('dotenv').config()

const Koa = require('koa')
const app = new Koa()
let api = require('koa-router')()
let users = require('./routes/users.js')
let tenants = require('./routes/tenants.js')
let landlords = require('./routes/landlords.js')
let auth = require('./routes/auth.js')
let docs = require('./routes/docs.js')
let props = require('./routes/props.js')
let messages = require('./routes/messages.js')
let payments = require('./routes/payments.js')
let config = require('../webpack.config.js')
let db = require('../db/db_config.js')
const bodyParser = require('koa-bodyparser');
let send = require('koa-send');
const path = require('path')
let serve = require('koa-static')
let session = require('koa-session')
let cors = require('koa-cors')

// db connection
// db now available from ctx throughout app
app.context.db = db

// middleware
let koaWebpack = require('koa-webpack')
const middleware = koaWebpack({
  config: config
})
app.use(middleware)
app.use(cors())
app.use(serve(__dirname + 'dist'));

// bodyparser
// the parsed body will store in ctx.request.body
// if nothing was parsed, body will be an empty object {}
app.use(bodyParser())

app.keys = ['ironmen']
app.use(session(app))

const redirToIndex = async (ctx, next) => {
	ctx.redirect('/') 
}

const authFunc = async (ctx, next) => {
	console.log(ctx.session)
	ctx.session.isLoggedIn = ctx.session.isLoggedIn || false
	if (!ctx.session.isLoggedIn) {
	  //redirToIndex(ctx, next) 
	}
	  await next()
}
app.use(authFunc)


// routing
api.use('/api/users', users.routes.routes())
api.use('/api/tenants', tenants.routes.routes())
api.use('/api/docs', docs.routes.routes())
api.use('/api/props', props.routes.routes())
api.use('/api/messages', messages.routes.routes())
api.use('/api/payments', payments.routes.routes())
api.use('/api/auth', auth.routes.routes())
api.use('/api/landlords', landlords.routes.routes())

// use router
app
	.use(api.routes())
	.use(api.allowedMethods())

const port = process.env.PORT || 8000

app.use(async (ctx) => { 
  await send(ctx, '/index.html', { root: 'dist' }) 
})

app.listen(port, () => {
	console.log('Listening on port: ', port)
})

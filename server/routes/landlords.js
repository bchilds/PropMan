let router = require('koa-router')()
let props = require('./props.js')
let payments = require('./payments.js')
let messages = require('./messages.js')
let Tenants = require('./tenants.js')
let Promise = require('bluebird')


const createLandlord = async (ctx, user) => {
	console.log(`creating landlord.........`)
	let ll, llRows
	llRows = await ctx.db.query(`INSERT INTO landlords (user_id) VALUES (${user.user_id}) RETURNING *`)
	ll = llRows.rows[0]
	return ll
}
exports.createLandlord = createLandlord

const getLandlord = async (ctx, user_id) => {
	let ll, llRows
	llRows = await ctx.db.query(`SELECT landlords.*, users.user_name FROM landlords FULL OUTER JOIN users ON landlords.user_id = users.user_id WHERE landlords.user_id = ${user_id};`)
	ll = llRows.rows[0]
	return ll
}
exports.getLandlord = getLandlord

const getLandlordById = async (ctx, landlord_id) => {
	// =========================
	// MIGHT NOT BE WORKING
	// =========================
	let ll, llRows
	llRows = await ctx.db.query(`SELECT landlords.*, users.user_name FROM landlords FULL OUTER JOIN users ON landlords.user_id = users.user_id WHERE landlord_id = ${landlord_id};`)
	ll = llRows.rows[0]
	return ll
}
exports.getLandlordById = getLandlordById

const getLandlordByPropId = async (ctx, prop_id) => {
	let ll, llRows
	llRows = await ctx.db.query(`SELECT landlords.*, users.user_name from landlords FULL OUTER JOIN users ON landlords.user_id = users.user_id WHERE landlord_id = ${prop_id};`)
	ll = llRows.rows[0]
	return ll
}
exports.getLandlordByPropId = getLandlordByPropId

const getLandlordData = async (ctx, user) => {
	let landlord, properties, transactions, msgs, activeTenants
	landlord = await getLandlord(ctx, user.user_id)
	if(landlord) {
		[properties, transactions, msgs, activeTenants] = await Promise.all([
			props.getLandlordProperties(ctx, landlord.landlord_id),
			payments.getUserTransactions(ctx, landlord),
			messages.getUserMessages(ctx, landlord.user_id),
			Tenants.getLandlordTenants(ctx, landlord.landlord_id, 'act')
			])
		return {landlord: landlord, properties: properties, transactions: transactions, messages:msgs, activeTenants:activeTenants}
	} else {
		return null
	}
}
exports.getLandlordData = getLandlordData

router
	.get('/:user_id', async (ctx, next) => {
		let ll 
		ll = await getLandlord(ctx, ctx.params.user_id)
		if(ll) {
			ctx.response.status = 302
			ctx.body = ll
		} else {
			ctx.response.status = 404
			ctx.body = 'No landlord found by that ID'
		}
	})
	.post('/', async (ctx, next) => {
		//ctx.request.body = {user}
		let ll
		if(ctx.request.body.user) ll = await createLandlord(ctx, ctx.request.body.user)
		if(ll) {
			ctx.response.status = 201
			ctx.body = ll
		} else {
			ctx.response.status = 400
			ctx.body = `There was an error creating the landlord`
		}
	})
	.post('/data', async (ctx, next) => {
		let data
		// ctx.request.body = {user}
		if(ctx.request.body.user) data = await getLandlordData(ctx, ctx.request.body.user)
		if(data) {
			ctx.response.status = 302
			ctx.body = data
		} else {
			ctx.response.status = 400
			ctx.body = `There was an error with your request`
		}
	})
	.put('/merchant/:landlord_id', async (ctx, next) => {
		let ll
		ll = await updateMerchant(ctx, ctx.params.landlord_id)
		if(ll) {
			ctx.response.status = 200
			ctx.body = ll
		} else {
			ctx.response.status = 400
			ctx.body = `There was an error updating merchant_id`
		}
	})
	.get('/property/:prop_id', async (ctx, next) => {
		let ll
		ll = await getLandlordByPropId(ctx, ctx.params.prop_id)
		if(ll) {
			ctx.response.status = 302
			ctx.body = ll
		} else {
			ctx.response.status = 404
			ctx.body = 'No landlord found for that property ID'
		}
	})
exports.routes = router



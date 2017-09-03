let router = require('koa-router')()
let Messages = require('./messages.js')


const getProperty = async (ctx, property_id) => {
	let property = await ctx.db.query(`SELECT * FROM properties WHERE property_id = ${property_id};`)
	return property.rows[0]
}
exports.getProperty = getProperty

const getLandlordProperties = async (ctx, landlord_id) => {
	let propsRows, props
	propsRows = await ctx.db.query(`SELECT * FROM properties WHERE landlord_id = ${landlord_id};`)
	props = propsRows.rows
	return props
}
exports.getLandlordProperties = getLandlordProperties

const addProperty = async (ctx, landlord_id) => {
	let propsRows, prop, obj
	obj = ctx.request.body
	propsRows = await ctx.db.query(`INSERT INTO properties (property_name, address, city, state_abbrv, landlord_id) VALUES ('${obj.property_name}', '${obj.address}', '${obj.city}', '${obj.state_abbrv}', ${landlord_id}) RETURNING *;`)
	prop = propsRows.rows[0]
	return prop
}
exports.addProperty = addProperty

const getPropertyTenants = async (ctx, property_id, tenant_id) => {
	//gets active tenants
	let tenantsRows, tenants
	if(tenant_id) {
		tenantsRows = await ctx.db.query(`SELECT tenants.*, users.user_name FROM tenants FULL OUTER JOIN users ON tenants.user_id = users.user_id WHERE tenants.property_id = ${property_id} AND tenants.is_active = true AND tenants.tenant_id <> ${tenant_id};`)
	} else {
		tenantsRows = await ctx.db.query(`SELECT tenants.*, users.user_name FROM tenants FULL OUTER JOIN users ON tenants.user_id = users.user_id WHERE tenants.property_id = ${property_id} AND tenants.is_active = true;`)
	}
	tenants = tenantsRows.rows
	return tenants
}
exports.getPropertyTenants = getPropertyTenants

router
	.get('/:id', async (ctx, next) => {
		ctx.body = await getProperty(ctx, ctx.params.id)
	})
	.get('/all/:landlord_id', async (ctx, next) => {
		ctx.body = await getLandlordProperties(ctx, ctx.params.landlord_id)
	})
	.get('/broadcasts/:property_id', async (ctx, next) => {
		ctx.body = await Messages.getPropertyBroadcasts(ctx, ctx.params.property_id)
	})
	.post('/', async (ctx, next) => {
		// {landlord_id, property_name, address, city, state_abbrv}
		ctx.body = await addProperty(ctx, ctx.request.body.landlord_id)
	})
exports.routes = router
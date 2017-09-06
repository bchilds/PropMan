
//server setup
const { Pool, Client } = require('pg')
const bodyParser = require('koa-bodyparser');

let db, tenant, tenant2, ctx, user, landlord, property, server, request
db = new Pool()
let supertest = require('supertest')
let app = require('../setup.js')
app.context.db = db


// use router
let Props = require('../../server/routes/props.js')
let api = require('koa-router')()
app.use(bodyParser())
api.use('/api/props', Props.routes.routes())
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
		isLandlord: false
	}
	// clear test users
	await db.query(`DELETE FROM users WHERE email = '${testUser.email}';`)

	// set test user
	user = await db.query(`INSERT INTO users (user_name, email, user_password, is_landlord) VALUES ('${testUser.user_name}', '${testUser.email}', '${testUser.password}', ${testUser.isLandlord}) RETURNING *;`)
	user = user.rows[0]

	// set test landlord
	landlord = await db.query(`INSERT INTO landlords (user_id) VALUES (${user.user_id}) RETURNING *;`)
	landlord = landlord.rows[0]

	// set test property
	property = await db.query(`INSERT INTO properties (property_name, landlord_id) VALUES ('Test Prop', ${landlord.landlord_id}) RETURNING *;`)
	property = property.rows[0]

	// set two test tenants
	tenant = await db.query(`INSERT INTO tenants (tenant_email, property_id) VALUES ('test1@jest.com', ${property.property_id}) RETURNING *;`)
	tenant = tenant.rows[0]
	tenant2 = await db.query(`INSERT INTO tenants (tenant_email, property_id) VALUES ('test2@jest.com', ${property.property_id}) RETURNING *;`)
	tenant2 = tenant2.rows[0]

	// set up ctx config
	ctx = {request: {}}
	ctx.db = db
})

afterAll( async () => {
	await Promise.all([
	db.query(`DELETE FROM users WHERE email = '${user.email}';`),
	db.query(`DELETE FROM properties WHERE property_id = ${property.property_id};`),
	db.query(`DELETE FROM landlords WHERE landlord_id = ${landlord.landlord_id};`),
	db.query(`DELETE FROM tenants WHERE tenant_id = ${tenant.tenant_id};`),
	db.query(`DELETE FROM tenants WHERE tenant_id = ${tenant2.tenant_id};`),
	db.query(`DELETE FROM messages WHERE property_id = ${property.property_id};`)
		])
	db.end()
  server.close()
})

beforeEach ( () => {
	ctx.request.body = {
		tenant_email: 'tenant@jest.test',
		property_id: property.property_id,
		rent: 750,
		due_date: '09/01/2017',
		user: user
	}
})

afterEach( async () => {
	// if(tenant && tenant.tenant_id) {
	// 	await db.query(`DELETE FROM tenants WHERE tenant_id = ${tenant.tenant_id};`)
	// 	tenant = undefined
	// }

	// if(tenant2 && tenant2.tenant_id) {
	// 		await db.query(`DELETE FROM tenants WHERE tenant_id = ${tenant2.tenant_id};`)
	// 		tenant = undefined
	// 	}
})

//test get all tenants
test(`Test getting all tenants at a property`, async () => {
	let results = await Props.getPropertyTenants(ctx, property.property_id)
	expect(results.length).toBeGreaterThan(1)
})

//test getProperty
test(`Test that a property can be retrieved by id`, async () => {
	let results, prop
	results = await request.get(`/api/props/${property.property_id}`)
	prop = results.body
	expect(prop.property_id).toBe(property.property_id)
})

//test post route, addProperty
test(`Test that a new property can be created by route`, async () => {
	let newProp, results, newCtx
	newCtx = {request: {}}
	newCtx.request.body = {
		landlord_id: landlord.landlord_id,
		property_name: `Other test prop`,
		address: `Some address`,
		city: `Some City`,
		state_abbrv: `TX`
	}
	results = await request.post(`/api/props`).send(newCtx.request.body)
	expect(results.body.property_id).toBeTruthy()	
})

//test getLandlordProperties
test(`Test that all a landlord's properties are retrieved`, async () => {
	let results, obj
	results = await request.get(`/api/props/all/${landlord.landlord_id}`)
	obj = results.body
	expect(Array.isArray(obj)).toBe(true)
	expect(obj.length).toBeGreaterThan(1)
})

//test broadcasts route
test(`Test that property broadcasts are retrieved`, async () => {
	let result, broadcasts, message
	message = await ctx.db.query(`INSERT INTO messages (message_content, message_type, property_id) VALUES ('Test broadcast', 'broadcast', ${property.property_id}) RETURNING *;`)
	message = message.rows[0]
	result = await request.get(`/api/props/broadcasts/${property.property_id}`)
	broadcasts = result.body
	expect(broadcasts.length).toBeGreaterThan(0)
	expect(broadcasts[0].message_content).toBe(message.message_content)
})








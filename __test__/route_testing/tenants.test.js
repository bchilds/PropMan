
//server setup
const { Pool, Client } = require('pg')
const bodyParser = require('koa-bodyparser');

let db, tenant, user, landlord, property, ctx, server, request 
db = new Pool()
let supertest = require('supertest')
let app = require('../setup.js')
app.context.db = db


// use router
let Tenants = require('../../server/routes/tenants.js')
let api = require('koa-router')()
app.use(bodyParser())
api.use('/api/tenants', Tenants.routes.routes())
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
	// set up ctx config
	ctx = {request: {}}
	ctx.db = db
})

afterAll( async () => {
	await db.query(`DELETE FROM users WHERE email = '${user.email}';`)
	await db.query(`DELETE FROM properties WHERE property_id = ${property.property_id};`)
	await db.query(`DELETE FROM landlords WHERE landlord_id = ${landlord.landlord_id};`)
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
	if(tenant && tenant.tenant_id) {
		await db.query(`DELETE FROM tenants WHERE tenant_id = ${tenant.tenant_id};`)
		tenant = undefined
	}
})

/*
Tests:
- Landlord makes a tenant - tenant has no user, no active tenant
- Landlord makes a tenant - tenant has no user, active tenant with no property
- Landlord makes a tenant - tenant has no user, active tenant with property
- Landlord makes a tenant - tenant has user, no active tenant
- Landlord makes a tenant - tenant has user, active tenant
Tenant makes a tenant - has active tenant
Tenant makes a tenant - has no active tenant
Active Tenant data is retrieved (on signin)
*/

test(`Landlord makes a tenant with no user`, async () => {
	let results
	ctx.request.body.user = undefined
	results = await request.post(`/api/tenants/bylandlord/create`).send(ctx.request.body)
	tenant = results.body
	expect(results.status).toBe(201)
	expect(tenant.property_id).toBeTruthy()
	expect(tenant.user_id).toBeFalsy()
})

test(`Landlord makes a tenant with no user but has active tenant record with no property`, async () => {
	// there is no user and the property is gone, so just update tenant record
	let results, testTenant
	ctx.request.body.user = undefined
	testTenant = await ctx.db.query(`INSERT INTO tenants (tenant_email, is_active) VALUES ('tenant@jest.test', true) RETURNING *;`)
	testTenant = testTenant.rows[0]
	results = await request.post(`/api/tenants/bylandlord/create`).send(ctx.request.body)
	tenant = results.body
	expect(results.status).toBe(202)
	expect(tenant).toBeTruthy()
	if(testTenant) await ctx.db.query(`DELETE FROM tenants WHERE tenant_id = ${testTenant.tenant_id};`)
})

test(`Landlord makes a tenant with no user but has active tenant record with property`, async () => {
	let results
	ctx.request.body.user = undefined
	let testTenant = await Tenants.createNewTenant(ctx, null, property.property_id)
	results = await request.post(`/api/tenants/bylandlord/create`).send(ctx.request.body)
	tenant = results.body
	expect(results.status).toBe(403)
	// expect(null).toBe(null)
	if(testTenant) await ctx.db.query(`DELETE FROM tenants WHERE tenant_id = ${testTenant.tenant_id};`)
})

test(`Landlord makes a tenant with user but has no active tenant record`, async () => {
	let results
	results = await request.post(`/api/tenants/bylandlord/create`).send(ctx.request.body)
	tenant = results.body
	expect(results.status).toBe(201)
	expect(tenant).toBeTruthy()
})

test(`Landlord makes a tenant with user but has active tenant record with no property`, async () => {
	// there is no user and the property is gone, create new record
	let results
	let testTenant = await Tenants.createNewTenant(ctx, user, null)
	results = await request.post(`/api/tenants/bylandlord/create`).send(ctx.request.body)
	tenant = results.body
	expect(results.status).toBe(201)
	expect(tenant).toBeTruthy()
	if(testTenant) await ctx.db.query(`DELETE FROM tenants WHERE tenant_id = ${testTenant.tenant_id};`)
})

test(`Landlord makes a tenant with user but has active tenant record with property`, async () => {
	let results
	let testTenant = await Tenants.createNewTenant(ctx, user, property.property_id)
	results = await request.post(`/api/tenants/bylandlord/create`).send(ctx.request.body)
	tenant = results.body
	expect(results.status).toBe(403)
	if(testTenant) await ctx.db.query(`DELETE FROM tenants WHERE tenant_id = ${testTenant.tenant_id};`)
})

// test(`Tenant makes a tenant, active tenant record`, async () => {

// })

// test(`Tenant makes a tenant, NO active tenant record`, async () => {
	
// })

// test (`Get all tenants from property` async () => {

//})

test(`Retrieve tenant data successfully`, async () => {
	let results
	tenant = await Tenants.createNewTenant(ctx, user, property.property_id)
	expect(tenant).toBeTruthy()
	results = await Tenants.retrieveActiveTenantData(ctx, tenant)
	// console.log(results)
	expect(results.tenant).toBe(tenant)
})




//server setup
const { Pool, Client } = require('pg')
const bodyParser = require('koa-bodyparser');

let db, prop, tenant, server, request, ctx
db = new Pool()
let supertest = require('supertest')
let app = require('../setup.js')
app.context.db = db


// use router
let Docs = require('../../server/routes/docs.js')
let api = require('koa-router')()
app.use(bodyParser())
api.use('/api/docs', Docs.routes.routes())
app
	.use(api.routes())
	.use(api.allowedMethods())

beforeAll( async () => {
	server = app.listen()
	request = supertest(server)

	prop = await db.query(`INSERT INTO properties (property_name) VALUES ('jest_test_prop') RETURNING *;`)
	prop = prop.rows[0]
	tenant = await db.query(`INSERT INTO tenants (tenant_email, rent, is_active) VALUES ('jesttest@test.com', 750, true) RETURNING *;`)
	tenant = tenant.rows[0]

	ctx = {request: {}}
	ctx.request.body = {
				landlord_id: null, 
				doc_type: "rawtext",
				tenant_id: tenant.tenant_id,
				property_id: prop.property_id,
				doc_body: "Test doc"
	}	
	ctx.db = db
})


afterAll( async () => {
	await db.query(`DELETE FROM properties WHERE property_id = ${prop.property_id};`)
  db.end()
  server.close()
})

test('create rawtext doc', async () => {

	let rawDoc = await Docs.createRawtext(ctx)
  expect(rawDoc.doc_body).toBe("Test doc")

})

test('find rawtext doc', async () => {

  let tenant_doc = await Docs.getUserDocs(ctx, tenant)
  expect(tenant_doc.tenantDocs.length).toBe(1)
})


//need to test routes


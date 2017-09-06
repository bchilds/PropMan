let multifactor = require('../server/multifactor.js')
let { Pool } = require('pg')

//test basic functionality
test(`Get a secret key, generate a token validate it`, async () => {
	let secret = await multifactor.genSecretKey()
	console.log(secret)
	let token = await multifactor.genTimeToken(null, secret)
	expect(await multifactor.validateToken(null, token, secret)).toBe(true)
})
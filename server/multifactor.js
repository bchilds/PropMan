let speakeasy = require('speakeasy')
let qrcode = require('qrcode')

const genSecretKey = async (ctx, next) => {
	console.log(await speakeasy.generateSecret({length: 32, name: 'Rentopia'}))
	return await speakeasy.generateSecret({length: 32, name: 'Rentopia'})
}
exports.genSecretKey = genSecretKey

const genTimeToken = async (ctx, key, next) => {
	//let secret = /////retrieve secret here
	let secret
	if(key) secret = key
	let token = speakeasy.totp({
		secret: secret,
		encoding: 'base32',
		// algorithm: 'sha256' //This is not controlled by us with Google
	})
	return token
}
exports.genTimeToken = genTimeToken

let validateToken = async (ctx, token, secret, next) => {
	let validates
	//secret = /////retrieve secret here
	validates = await speakeasy.totp.verify({
		secret: secret,
		encoding: 'base32',
		token: token,
		window: 10,
		// algorithm: 'sha256'  //This is not controlled by us with Google
	})
	return validates
}
exports.validateToken = validateToken

let updateUserMulti = async (ctx, user) => {
	let out
	out = await ctx.db.query(`UPDATE users SET (use_twofactor) = (true) WHERE user_id = ${user.user_id} RETURNING *;`)
	out = out.rows[0]
	return out
}
exports.updateUserMulti = updateUserMulti

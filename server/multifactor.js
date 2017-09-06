let speakeasy = require("speakeasy")

const genSecretKey = async (ctx, next) => {
	return await speakeasy.generateSecret({length: 5, name: 'Rentopia'})
}
exports.genSecretKey = genSecretKey

const genTimeToken = async (ctx, key, next) => {
	//let secret = /////retrieve secret here
	let secret
	if(key) secret = key
	let token = speakeasy.totp({
		secret: secret.base32,
		encoding: 'base32',
		algorithm: 'sha256'
	})
	return token
}
exports.genTimeToken = genTimeToken

let validateToken = async(ctx, token, secret, next) => {
	let validates

	//secret = /////retrieve secret here
	validates = await speakeasy.totp.verify({
		secret: secret.base32,
		encoding: 'base32',
		token: token,
		window: 10,
		algorithm: 'sha256'
	})
	return validates
}
exports.validateToken = validateToken


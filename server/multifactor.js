let speakeasy = require("speakeasy")

const genSecretKey = async (ctx, next) => {
	return await speakeasy.generateSecret()
}
exports.genSecretKey = generateSecret

const genTimeToken = async (ctx, next) => {
	//let secret = /////retrieve secret here
	
	let token = speakeasy.totp({
		secret: secret.base32,
		encoding: 'base32',
		algorithm: 'sha256'
	})
	return token
}
exports.genTimeToken = genTimeToken

let validateToken = async(ctx, token, next) => {

	//let secret = /////retrieve secret here
	let validates = await speakeasy.totp.verify({
		secret: secret.base32,
		encoding: 'base32',
		token: token,
		window: 10,
		algorithm: 'sha256'
	})
	
}
exports.validateToken = validateToken


let router = require('koa-router')()
let Users = require('./users.js')
let Landlords = require('./landlords.js')
let Tenants = require('./tenants.js')

const getUserMessages = async (ctx, user_id) => {
	let messageRows
	if(!user_id) user_id = null
	const values = [user_id]
	messageRows = await ctx.db.query(`SELECT * FROM messages WHERE recipient_id = $1 OR sender_id = $1 AND property_id IS NULL;`, values)
	// returns array of messages
	return messageRows.rows
}
exports.getUserMessages = getUserMessages

const getPropertyBroadcasts = async (ctx, property_id) => {
	let broadcastsRows, broadcasts
	const values = [property_id]
	broadcastsRows = await ctx.db.query(`SELECT * FROM messages WHERE property_id = $1 AND sender_id IS NULL AND recipient_id IS NULL;`, values)
	broadcasts = broadcastsRows.rows
	return broadcasts
}
exports.getPropertyBroadcasts = getPropertyBroadcasts

const makeMessage = async (ctx) => {
	let obj, messageRows, message
	obj = ctx.request.body
	if(obj.property_id && !obj.sender_id && !obj.recipient_id) {
		//it is a broadcast 
		const values = [obj.message_content, 'broadcast', obj.property_id, obj.message_title]
		messageRows = await ctx.db.query(`INSERT INTO messages (message_content, message_type, property_id, message_title) VALUES ($1, $2, $3, $4) RETURNING *;`, values)
		message = messageRows.rows[0]
		return message
	} else if(!obj.property_id && obj.sender_id && obj.recipient_id) {
		//it is a DM
		const values = [obj.message_content, obj.sender_id, obj.sender_name, obj.recipient_id, obj.recipient_name]
		messageRows = await ctx.db.query(`INSERT INTO messages (message_content, message_type, sender_id, sender_name, recipient_id, recipient_name) VALUES ($1, 'direct', $2, $3, $4, $5) RETURNING *;`, values)
		message = messageRows.rows[0]
		return message
	} else {
		//ERROR
		console.log('Not a valid message type')
		return null
	}
}
exports.makeMessage = makeMessage

const updateViewed = async (ctx, message_id) => {
	let message, messageRows
	const values = [message_id]
	messageRows = ctx.db.query(`UPDATE messages SET is_read = NOT is_read WHERE message_id = $1 RETURNING *;`, values)
	message = messageRows.rows[0]
	return message
}

router
	.get('/:message_id', async (ctx, next) => {
		let messageRows
		const values = [ctx.params.message_id]
		messageRows = await ctx.db.query(`SELECT * FROM messages WHERE message_id = $1;`, values)
		ctx.body = messageRows.rows[0]
	})
	.get('/broadcasts/:property_id', async (ctx, next) => {
		let broadcasts
		broadcasts = await getPropertyBroadcasts(ctx, ctx.params.property_id)
		ctx.body = broadcasts
	})
	.get('/direct/:user_id', async (ctx, next) => {
		let user, messages, found
		found = false
		//get user by ID
		user = await Users.getUserById(ctx, ctx.params.user_id)
		if(user) {
			found = true
			messages = await getUserMessages(ctx, user.user_id)
		}
		if(found) {
			ctx.response.status = 302
			ctx.body = messages
		} else {
			ctx.response.status = 404
			ctx.body = `User not found, messages could not be loaded`
		}
	})
	.post('/', async (ctx, next) => {
		let message = await makeMessage(ctx)
		if(message !== null) {
			ctx.response.status = 201
			ctx.body = message
		} else {
			ctx.response.status = 400
			ctx.body = 'Message failed'
		}
	})
	.put('/:message_id', async (ctx, next) => {
		let message = await updateViewed(ctx, ctx.params.message_id)
		if(message !== null) {
			ctx.response.status = 201
			ctx.body = message
		} else {
			ctx.response.status = 400
			ctx.body = 'Message update failed'
		}
	})
	exports.routes = router





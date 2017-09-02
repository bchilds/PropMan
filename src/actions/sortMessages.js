export const SORT_MESSAGES = 'sort_messages'
export const CURRENT_CONVO = 'current_convo'

export function sortMessages(messages, userId) {
	var mesgObj = {}
console.log('userId is ', userId)
	messages.forEach(obj => {
		if (obj.recipient_id !== userId) {
			mesgObj[obj.recipient_id] = mesgObj[obj.recipient_id] || []
			mesgObj[obj.recipient_id].push(obj)
	  } else {
	  	mesgObj[obj.sender_id] = mesgObj[obj.sender_id] || []
	  	mesgObj[obj.sender_id].push(obj)
	  }
	})
	console.log('mesgObj', mesgObj)
	// for (var key in mesgObj) {
	// 	mesgObj[key].sort(function (a, b) {
	//   return new Date(a.created_date).getTime() - new Date(b.created_date).getTime() 
	// }
	return {
		type: SORT_MESSAGES,
		payload: mesgObj
	}
}
// sortMessages(stuff, 1)

export function setCurrentConvo(convoArray, recipId) {

	var obj = {
		convo: convoArray || [{message_content: "You have no messages with this contact"}],
		id: recipId
	}
	console.log('convo array', convoArray)
	return {
		type: CURRENT_CONVO,
		payload: obj
	}
}
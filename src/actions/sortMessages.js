export const SORT_MESSAGES = 'sort_messages'
export const CURRENT_CONVO = 'current_convo'

export function sortMessages(messages, userId) {
	var mesgObj = {}
	messages.forEach((obj, i) => {
		if (obj !== null && obj !== undefined) {
			console.log('obj is ', obj === null)
			if (obj.recipient_id !== userId) {
				mesgObj[obj.recipient_id] = mesgObj[obj.recipient_id] || []
				mesgObj[obj.recipient_id].push(obj)
		  } else {
		  	mesgObj[obj.sender_id] = mesgObj[obj.sender_id] || []
		  	mesgObj[obj.sender_id].push(obj)
		  }
	  }
	})

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
	return {
		type: CURRENT_CONVO,
		payload: obj
	}
}
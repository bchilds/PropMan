export const SORT_MESSAGES = 'sort_messages'
export const CURRENT_CONVO = 'current_convo'

var arr = ['Sorting is fun', 'sorting isnt so fun', 'who needs sorting anyways', 'features features features features features features features features features features features features features features features features features features features features features features features features', 'efficiency']
var stuff = [
{sender_id: 1, recipient_id: 2, recipient_name: 'Ben', message_content: arr[0], is_read: true},
{sender_id: 1, recipient_id: 3, recipient_name: 'Shebaz', message_content: arr[1], is_read: true},
{sender_id: 1, recipient_id: 4, recipient_name: 'Jordan', message_content: arr[2], is_read: true},
{sender_id: 2, recipient_id: 1, recipient_name: 'Eric', message_content: arr[3], is_read: true},
{sender_id: 3, recipient_id: 1, recipient_name: 'Eric', message_content: arr[4], is_read: true}
]
export function sortMessages(messages, userId) {
	var mesgObj = {}
console.log('userId is ', userId)
	stuff.forEach(obj => {
		if (obj.recipient_id !== userId) {
			mesgObj[obj.recipient_id] = mesgObj[obj.recipient_id] || []
			mesgObj[obj.recipient_id].push(obj)
	  } else {
	  	mesgObj[obj.sender_id] = mesgObj[obj.sender_id] || []
	  	mesgObj[obj.sender_id].push(obj)
	  }
	})
	// console.log(mesgObj)
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

export function currentConvo(convoArray, recipId) {
	var obj = {
		convo: convoArray,
		id: recipId
	}
	return {
		type: CURRENT_CONVO,
		payload: obj
	}
}
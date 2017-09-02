import axios from 'axios'

export const DIRECT_MESSAGES = 'direct_messages'

const ROOT_URL = 'http://localhost:8000'

export function sendMessage(info) {
	console.log(info)
  const request = axios.post(`${ROOT_URL}/api/messages/`, {
      sender_id: info.sendFrom,
      recipient_id: info.sendTo,
      message_content: info.message,
      sender_name: '',
      recipient_name: ''
  })

  return {
    type: DIRECT_MESSAGES,
    payload: request.data
  }

  // **** request should have userData, tenant info, messages, docs, media
}
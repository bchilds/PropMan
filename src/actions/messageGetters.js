import axios from 'axios'

export const DIRECT_MESSAGES = 'direct_messages'

const ROOT_URL = 'http://localhost:8000'

export function sendMessage(info) {
	console.log(info, typeof info.sender_id)
  const request = axios.post(`${ROOT_URL}/api/messages/`, {
      sender_id: info.sender_id,
      recipient_id: info.recipient_id,
      message_content: info.message_content
  })

  return {
    type: DIRECT_MESSAGES,
    payload: request
  }

  // **** request should have userData, tenant info, messages, docs, media
}
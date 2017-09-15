import axios from 'axios'

export const DIRECT_MESSAGES = 'direct_messages'

const ROOT_URL = process.env.NODE_ENV === 'production' ? 'http://www.myrentopia.com': 'http://localhost:8000'

export function sendMessage(info) {
	console.log(info, info.sender_id)
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


export function sendBroadcast(info) {
  console.log('broadcast action', info)
  const request = axios.post(`${ROOT_URL}/api/messages/`, info)

  return {
    type: DIRECT_MESSAGES,
    payload: request
  }

  // **** request should have userData, tenant info, messages, docs, media
}

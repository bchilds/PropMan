import axios from 'axios'

export const SET_MULTI = 'set_multi'

const ROOT_URL = 'http://localhost:8000'



export function setMulti(user_id) {
  const request = axios.get(`${ROOT_URL}/api/users/multiset/${user_id}`)
  
  return {
    type: SET_MULTI,
    payload: request
  }

  // **** request should have userData, tenant info, messages, docs, media
}


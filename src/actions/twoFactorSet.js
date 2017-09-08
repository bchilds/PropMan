import axios from 'axios'

export const SET_MULTI = 'set_multi'
export const REMOVE_MULTI = 'remove_multi'

const ROOT_URL = 'http://localhost:8000'



export function setMulti(user_id) {
  const request = axios.get(`${ROOT_URL}/api/users/multiset/${user_id}`)
  
  return {
    type: SET_MULTI,
    payload: request
  }

  // **** request should have user
}

export function removeMulti(user_id) {
  const request = axios.get(`${ROOT_URL}/api/users/multiremove/${user_id}`)
  
  return {
    type: REMOVE_MULTI,
    payload: request
  }

  // **** request should have user
}

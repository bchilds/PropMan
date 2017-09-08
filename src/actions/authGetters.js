import axios from 'axios'

export const USER_LOGIN = 'user_login'
export const USER_LOGOUT = 'user_logout'
export const CHECK_SESSION = 'check_session'

const ROOT_URL = 'http://localhost:8000'

export function signupUser(credentials, cb) {

  axios.post(`${ROOT_URL}/api/auth/signup`, {
    user_name: credentials.name,
    email: credentials.email,
    password: credentials.password,
    isLandlord: credentials.isLandlord
  })
  .catch((err) => {
    console.log('error signing up', err)
    cb(false)
  })
  .then((response) => {
    var data = {
    email: credentials.email,
    password: credentials.password
  }
    cb(true, data)
  })
}

export function loginUser(credentials) {
  const request = axios.post(`${ROOT_URL}/api/auth/signin`, {
      email: credentials.email,
      password: credentials.password,
      multi: credentials.multi,
  })
  
  return {
    type: USER_LOGIN,
    payload: request
  }

  // **** request should have userData, tenant info, messages, docs, media
}

export function logoutUser(cb) {
  const request = axios.get(`${ROOT_URL}/api/auth/logout`)
  return {
    type: USER_LOGOUT,
    payload: request
  }
}

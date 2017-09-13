import axios from 'axios'

export const USER_LOGIN = 'user_login'
export const USER_LOGOUT = 'user_logout'
export const CHECK_SESSION = 'check_session'
export const LOGIN_FAILURE = 'login_failure'

const ROOT_URL = process.env.NODE_ENV === 'production' ? 'http://myrentopia.com': 'http://localhost:8000'

export function signupUser(credentials, cb) {
  console.log('credentials', credentials)
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
  return function(dispatch) {  
    axios.post(`${ROOT_URL}/api/auth/signin`, {
        email: credentials.email,
        password: credentials.password,
        multi: credentials.multi,
    }).then((response) => {  
        dispatch({
          type: USER_LOGIN,
          payload: response
        })
    }).catch((err) => {
        dispatch({
          type: LOGIN_FAILURE,
          payload: true
        })
    })
  }
  

  // **** request should have userData, tenant info, messages, docs, media
}

export function logoutUser() {
  const request = axios.get(`${ROOT_URL}/api/auth/logout`)
  return {
    type: USER_LOGOUT,
    payload: request
  }
}

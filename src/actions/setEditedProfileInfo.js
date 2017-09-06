import axios from 'axios';

const ROOT_URL = 'http://127.0.0.1:8000'

export const SET_PROFILE = 'set_profile'

export function setEditedProfileInfo(credentials = {}, userId) {
	// *** Uncomment this when real data is set up on the database ****
  console.log('profile action', credentials, userId)
	const request = axios.put(`${ROOT_URL}/api/users/${userId}`, credentials)
  
  return {
  	type: SET_PROFILE,
  	payload: request
  }

}
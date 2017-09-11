import axios from 'axios';

export const FETCH_LL_PROPERTIES = 'fetch_landlord_properties'
export const ADD_PROPERTY = 'add_landlord_property'

const ROOT_URL = process.env.NODE_ENV === 'production' ? 'http://myrentopia.com': 'http://localhost:8000'

export function getProperties() {
  const request = axios.get(`${ROOT_URL}/api/props`)

  return {
    type: FETCH_LL_PROPERTIES,
    payload: request 
  }
}

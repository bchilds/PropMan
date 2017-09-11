import axios from 'axios'

export const FETCH_BROADCASTS = 'fetch_broadcasts';

const ROOT_URL = process.env.NODE_ENV === 'production' ? 'http://myrentopia.com': 'http://localhost:8000'

export function getBroadcasts(propertyId) {
	const request = axios.get(`${ROOT_URL}/api/props/broadcasts/${propertyId}`)

	return {
	  type: FETCH_BROADCASTS,
	  payload: request
	}
}
import axios from 'axios';

export const FETCH_LL_TENANTS = 'fetch_landlord_tenants'

const ROOT_URL = process.env.NODE_ENV === 'production' ? 'http://myrentopia.com': 'http://localhost:8000'

export function getPropertyTenants(landlordId) {
	var request = axios.get(`${ROOT_URL}/api/tenants/landlord/all/${landlordId}/act`) 
	// console.log(`in the action ${landlordId}`)
	return {
	  type: FETCH_LL_TENANTS,
	  payload: request
	}
}

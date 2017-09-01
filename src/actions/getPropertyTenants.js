import axios from 'axios';

export const GET_PROPERTY_TENANTS = 'get_property_tenants'

const ROOT_URL = 'http://127.0.0.1:8000'

export function getPropertyTenants(propId) {
	var request = axios.get(`${ROOT_URL}/api/getTenantsNames?`) 

	return {
	  type: GET_PROPERTY_TENANTS,
	  payload: request.data
	}
}
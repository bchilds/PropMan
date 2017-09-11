import axios from 'axios';

export const ADD_LL_PROPERTY = 'add_landlord_property'
export const FETCH_LL_TENANTS = 'fetch_landlord_tenants'
export const ADD_LL_TENANT = 'add_landlord_tenant'

const ROOT_URL = process.env.NODE_ENV === 'production' ? 'http://myrentopia.com': 'http://localhost:8000'

export function addProperty(propDetails, cb) {
  const createdProp = axios.post(`${ROOT_URL}/api/props/`, {
    landlord_id: propDetails.landlord_id,
    property_name: propDetails.property_name,
    address: propDetails.address,
    city: propDetails.city,
    state_abbrv: propDetails.state_abbrv
  })

  return {
    type: ADD_LL_PROPERTY,
    payload: createdProp
  }

}

export function getTenants(landlord_id) {
  const tenants = axios.get(`${ROOT_URL}/api/tenants/landlord/all/${landlord_id}/act`)
  return {
    type: FETCH_LL_TENANTS,
    payload: tenants
  }
}

export function addTenant(tenantInfo, cb) {
  // console.log('addTenant function', JSON.stringify(tenantInfo));
  const associatedTenant = axios.post(`${ROOT_URL}/api/tenants/bylandlord/create`, {
    property_id: tenantInfo.property_id,
    tenant_email: tenantInfo.tenant_email,
    rent: tenantInfo.rent,
    due_date: tenantInfo.due_date
  })

  return {
    type: ADD_LL_TENANT,
    payload: associatedTenant
  }

}


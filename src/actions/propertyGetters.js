import axios from 'axios';

export const FETCH_PROPERTY_TENANT = 'fetch_landlord_property_tenant'
export const ADD_PROPERTY_TENANT = 'add_landlord_property_tenants'

const ROOT_URL = 'http://localhost:8000'

// export function getPropertyTenants(landlordId) {
//   var request = axios.get(`${ROOT_URL}/api/tenants/landlord/all/${landlordId}/act`) 
//   console.log(`in the action ${landlordId}`)
//   return {
//     type: FETCH_LL_TENANTS,
//     payload: request
//   }
// }

export function getPropertyTenants2(property_id) {
  const request = axios.get(`${ROOT_URL}/api/tenants/property/${property_id}`)
  console.log('getPropertyTenants function:', `${ROOT_URL}/api/tenants/property/${property_id}`)
  return {
    type: FETCH_PROPERTY_TENANT,
    payload: request 
  }
}

export function addPropertyTenant(tenantInfo, cb) {
  console.log('addTenant function', JSON.stringify(tenantInfo));
  const associatedTenant = axios.post(`${ROOT_URL}/api/tenants/bylandlord/create`, {
    property_id: tenantInfo.property_id,
    tenant_email: tenantInfo.tenant_email,
    rent: tenantInfo.rent,
    due_date: tenantInfo.due_date
  })

  return {
    type: ADD_PROPERTY_TENANT,
    payload: associatedTenant
  }

}

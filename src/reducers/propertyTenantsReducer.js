import { GET_PROPERTY_TENANTS } from '../actions/getPropertyTenants'

export function propertyTenants(state = [], action) {
  switch(action.type) {
    case GET_PROPERTY_TENANTS: 
      return action.payload

    default:
      return state;
  }
}
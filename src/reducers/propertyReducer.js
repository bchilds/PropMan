import { FETCH_PROPERTY_TENANT, ADD_PROPERTY_TENANT } from '../actions/propertyGetters.js'

export function propertyTenants2(state = [], action) {
  switch(action.type) {
    case FETCH_PROPERTY_TENANT: 
      return action.payload.response.data
    case ADD_PROPERTY_TENANT:
      return [...state, action.payload.data]
    default:
      return state
  }
}

import { USER_LOGIN } from '../actions/authGetters'
import { FETCH_LL_PROPERTIES, ADD_PROPERTY } from '../actions/landlordDashboardGetters'
import { ADD_LL_PROPERTY, FETCH_LL_TENANTS,ADD_LL_TENANT } from '../actions/landlordGetters'
import { FETCH_PROPERTY_TENANT, ADD_PROPERTY_TENANT } from '../actions/propertyGetters.js'



export function landlordProperties(state = [], action) {
  switch(action.type) {
    case USER_LOGIN: 
      return action.payload.data.properties || []
    case FETCH_LL_PROPERTIES:
      return action.payload.data
    case ADD_LL_PROPERTY:
      return [...state, action.payload.data] || []
    default:
      return state
  }
}

export function landlordTenants(state = [], action) {
  switch(action.type) {
    case USER_LOGIN: 
      return action.payload.data.activeTenants || []
    case FETCH_LL_TENANTS:
      return action.payload.data
    case ADD_LL_TENANT:
      return [...state, action.payload.data] || []
    case ADD_PROPERTY_TENANT:
      return [...state, action.payload.data] || []
    default:
      return state
  }
}

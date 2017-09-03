
import { USER_LOGIN } from '../actions/authGetters'
import { FETCH_LL_PROPERTIES, FETCH_LL_TENANTS, ADD_PROPERTY } from '../actions/landlordDashboardGetters'

// const properties = [
//   {property_id: 1, property_name: "RnM", address: "123 Fake Street", city: "Atlantis", state_abbrv: "DNR"},
//   {property_id: 2, property_name: "Fleabag Motel", address: "456 Fake Street", city: "Atlantis", state_abbrv: "DNR"},
//   {property_id: 3, property_name: "742 Evergreen Terrace", address: "742 Evergreen Terrace", city: "Springfield", state_abbrv: "MA"},
//   {property_id: 4, property_name: "Retirement Home", address: "789 Fake Street", city: "Springfield", state_abbrv: "MA"},
//   {property_id: 5, property_name: "Winterfell", address: "0 Castle Lane", city: "Westeros", state_abbrv: "GoT"}
// ]

export function landlordProperties(state = [], action) {
  switch(action.type) {
    case USER_LOGIN: 
    console.log('refreshing login', state)
      return action.payload.data.properties || null
    case ADD_PROPERTY:
      return [...state, action.payload.data] || null
    default:
    console.log('refreshing', state)
      return state
  }
}

export function landlordTenants(state = null, action) {
  switch(action.type) {
    case USER_LOGIN: 
      return action.payload.data.activeTenants || null
    case FETCH_LL_TENANTS:
      return action.payload.data
    default:
      return state
  }
}
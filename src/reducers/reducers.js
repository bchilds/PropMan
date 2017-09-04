import { SET_PROFILE } from '../actions/setEditedProfileInfo'
import { DIRECT_MESSAGES } from '../actions/messageGetters'
import { USER_LOGIN, USER_LOGOUT, TENANT_LOGIN, LL_LOGIN } from '../actions/authGetters'
import { FETCH_RENT, FETCH_MESSAGES, FETCH_DOCS, FETCH_SELECTED_MEDIA } 
	from '../actions/tenantDashboardGetters.js';

export function userData(state = {}, action) {
  switch(action.type) {
    case USER_LOGIN: 
    console.log('login request is ', action.payload)
      return action.payload.data.user
    case SET_PROFILE:
    	return Object.assign({}, state, action.payload.data)
    case USER_LOGOUT:
      return {}
    default:
      return state;
  }
}

export function isLoggedIn(state = null, action) {
  switch(action.type) {
    case USER_LOGIN:
      return true
    case USER_LOGOUT:
      return false
    // case CHECK_SESSION:
    //   return action.payload.data
    default:
      return state;
  }
}

export function tenantData(state = [], action) {
  switch(action.type) {
    case USER_LOGIN: 
      if (action.payload.data.tenant) {
        return action.payload.data.tenant
      } else {
        return state
      }

    default:
      return state;
  }
}

export function otherTenants(state = null, action) {
  switch(action.type) {
    case USER_LOGIN: 
      if (action.payload.data.otherTenants) {
        return action.payload.data.otherTenants
      } else {
        return state
      }

    default:
      return state;
  }
}

export function tenantsLandlord(state = null, action) {
  switch(action.type) {
    case USER_LOGIN: 
      if (action.payload.data.landlord) {
        return action.payload.data.landlord
      } else {
        return state
      }

    default:
      return state;
  }
}

export function landlordData(state = [], action) {
  switch(action.type) {
    case USER_LOGIN: 
      if (action.payload.data.landlord) {
        return action.payload.data.landlord
      } else {
        return state
      }

    default:
      return state;
  }
}

export function messages(state = null, action) {
  switch(action.type) {
    case USER_LOGIN: 
      return action.payload.data.messages

    case FETCH_MESSAGES: 
      return action.payload.messages

    case DIRECT_MESSAGES: 
    console.log('message reducer ', action.payload.data)
      var newArray = [...state, action.payload.data]
      console.log('message reducer ', newArray)
      return newArray

    case USER_LOGOUT: 
      return []

    default:
      return state;
  }
}

export function docs(state = [], action) {
  switch(action.type) {
    case USER_LOGIN: 
      if (action.payload.data.docs) {
        return action.payload.data.docs
      } else {
        return state
      }
    case FETCH_DOCS: 
      return action.payload.data.docs

    default:
      return state;
  }
}

import { FETCH_BROADCASTS } from '../actions/broadcastsGetter'
import { DIRECT_MESSAGES } from '../actions/messageGetters'
import { USER_LOGOUT, USER_LOGIN } from '../actions/authGetters'

export function broadcasts(state = [], action) {
  switch(action.type) {
    case FETCH_BROADCASTS: 
      if (action.payload.data) {
        return action.payload.data
      } else {
        return state
      }
    case DIRECT_MESSAGES: 
	    if (typeof action.payload.data !== 'string') {
	   		var newArray = [...state, action.payload.data]
	  	  return newArray
	  	} else {
	  		return state
	  	}
	  case USER_LOGOUT: 
	    return []
    case USER_LOGIN:
      if (action.payload.data.broadcasts) {
        return action.payload.data.broadcasts
      } else {
        return state
      }
    default:
      return state;
  }
}
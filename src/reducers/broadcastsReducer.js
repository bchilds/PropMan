import { FETCH_BROADCASTS } from '../actions/broadcastsGetter'
import { DIRECT_MESSAGES } from '../actions/messageGetters'
import { USER_LOGOUT, USER_LOGIN } from '../actions/authGetters'

export function broadcasts(state = [], action) {
  switch(action.type) {
    case FETCH_BROADCASTS: 
    console.log('payload is', action.payload)
      return action.payload.data
    case DIRECT_MESSAGES: 
	    if (typeof action.payload.data !== 'string') {
	   		var newArray = [...state, action.payload.data]
	  	  return newArray
	  	} else {
	  		return state
	  	}
	  case USER_LOGOUT: 
	    return []
    default:
      return state;
  }
}
import { FETCH_SELECTED_MEDIA } from '../actions/tenantDashboardGetters.js';
import { CURRENT_CONVO } from '../actions/sortMessages'
import { USER_LOGOUT, USER_LOGIN } from '../actions/authGetters'
import { FETCH_BROADCASTS } from '../actions/broadcastsGetter'

export function selectedTenantMedia(state = {}, action) {
	switch(action.type) {
		case FETCH_BROADCASTS:
			if (action.payload.data && action.payload.data.length) {
				let broadcasts = action.payload.data
				let newestBroadcast = broadcasts[broadcasts.length - 1]
				return {
					title: newestBroadcast.message_title,
					media: newestBroadcast.message_content
				}
			} else {
				return state
			}
		case FETCH_SELECTED_MEDIA:
		  return action.payload;

		default:
			return state;
	}
}

export function setCurrentConvo(state = [], action) {
	switch(action.type) {
	  case CURRENT_CONVO:
	    return action.payload.convo

    case USER_LOGOUT: 
      return []

	  default:
	  	return state;
	}
}

export function messageRecipient(state = null, action) {
	switch(action.type) {
	  case CURRENT_CONVO:
	    return action.payload.id

	  default:
	  	return state;
	}
}

export function convoPersonsName(state = '', action) {
	switch(action.type) {
	  case CURRENT_CONVO:
	    return action.payload.name
    case USER_LOGOUT: 
      return ''

	  default:
	  	return state;
	}
}

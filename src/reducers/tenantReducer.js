import { FETCH_SELECTED_MEDIA, SHOW_DONUT } from '../actions/tenantDashboardGetters.js';
import { CURRENT_CONVO } from '../actions/sortMessages'
import { USER_LOGOUT, USER_LOGIN } from '../actions/authGetters'
import { FETCH_BROADCASTS } from '../actions/broadcastsGetter'
import { REHYDRATE } from 'redux-persist/constants'

export function selectedTenantMedia(state = {}, action) {
	switch(action.type) {
		case FETCH_SELECTED_MEDIA:
		  return action.payload;
		case REHYDRATE:
			return {}
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

export function showDonut(state = true, action) {
	switch(action.type) {
		case SHOW_DONUT:
			return true
		case REHYDRATE:
			return true
		case FETCH_SELECTED_MEDIA:
			return false
		default:
			return state
	}
}

import { FETCH_SELECTED_MEDIA } from '../actions/tenantDashboardGetters.js';
import { CURRENT_CONVO } from '../actions/sortMessages'

export function selectedTenantMedia(state = null, action) {
	switch(action.type) {

		case FETCH_SELECTED_MEDIA:
		  return action.payload;

		default:
			return state;
	}
}

export function currentConvo(state = [], action) {
	switch(action.type) {
	  case CURRENT_CONVO:
	    return action.payload.convo

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

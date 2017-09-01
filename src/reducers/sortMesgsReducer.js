import { SORT_MESSAGES } from '../actions/sortMessages'

export function sortedMessages(state = {}, action) {
  switch(action.type) {
    case SORT_MESSAGES: 
      return action.payload

    default:
      return state;
  }
}
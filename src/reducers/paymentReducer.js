import { SEND_PAYMENT } from '../actions/paymentGetters'
import { USER_LOGIN } from '../actions/authGetters'

export function tenantPaidRent(state = null, action) {
  switch(action.type) {
    case SEND_PAYMENT: 
      return action.payload.data;

    default:
      return state;
  }
}

export function receivedTransactions(state=[], action) {
  switch(action.type) {
    case USER_LOGIN:
      if (action.payload.data.transactions) {
        return action.payload.data.transactions.receivedPayments
      } else {
        return state
      }
    default:
      return state
  }
}

export function sentTransactions(state=[], action) {
  switch(action.type) {
    case USER_LOGIN:
      if (action.payload.data.transactions) {
        return action.payload.data.transactions.sentPayments
      } else {
        return state
      }
    case SEND_PAYMENT: 
      if (action.payload.data) {
        return [...state, action.payload.data]
      }
    default:
      return state
  }
}
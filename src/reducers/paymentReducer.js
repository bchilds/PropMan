import { SEND_PAYMENT, ADD_BILL, BILL_SHARE_PAYMENT, SUBMERCHANT_CREATION_FAILURE } from '../actions/paymentGetters'
import { USER_LOGIN } from '../actions/authGetters'
import { REHYDRATE } from 'redux-persist/constants'

export function tenantPaidRent(state = false, action) {
  switch(action.type) {
    case SEND_PAYMENT: 
      return true
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
    case BILL_SHARE_PAYMENT:
      if (action.payload.data) {
        console.log(action.payload.data)
        return action.payload.data.allTransactions.receivedPayments
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
        return [...state, action.payload.data.transaction]
      } else {
        return state
      }
    case ADD_BILL: 
      if (action.payload.data) {
        return [...state].concat(action.payload.data.newTransactions)
      } else {
        return state
      }      
    case BILL_SHARE_PAYMENT:
      if (action.payload.data) {
        return action.payload.data.allTransactions.sentPayments
      } else {
        return state
      }
    default:
      return state
  }
}

export function expenses(state=[], action) {
  switch(action.type) {
    case USER_LOGIN:
      if (action.payload.data.tenant) {
        return action.payload.data.expenses
      } else {
        return state
      }
    case ADD_BILL:
      return action.payload.data.newExpenses
    case SEND_PAYMENT: 
      return action.payload.data.newExpenses
    case BILL_SHARE_PAYMENT:
      if (action.payload.data) {
        return action.payload.data.newExpenses
      } else {
        return state
      }
    default:
      return state
  }
}

export function submerchantCreationFailure(state = {failure: false, errors: []}, action) {
  switch(action.type) {
    case SUBMERCHANT_CREATION_FAILURE:
      return {
        failure: true,
        errors: action.payload.data.split('\n')
      }
    case REHYDRATE:
      return {failure: false, errors: []}
    default:
      return state
  }
}
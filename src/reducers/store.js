import { combineReducers } from 'redux';
import { userData, tenantData, otherTenants, tenantsLandlord, landlordData, messages, docs, isLoggedIn} from './reducers'
import { landlordProperties, landlordTenants } from './landlordReducer'
import { selectedTenantMedia, setCurrentConvo, messageRecipient, convoPersonsName } from './tenantReducer'
import { tenantPaidRent, receivedTransactions, sentTransactions } from './paymentReducer'
import { broadcasts } from './broadcastsReducer'
import { sortedMessages } from './sortMesgsReducer'
import { propertyTenants, sortedTenantsByProp } from './propertyTenantsReducer'
import { propertyTenants2 } from './propertyReducer'

import { USER_LOGOUT } from '../actions/authGetters'


const appReducer = combineReducers({
  selectedTenantMedia,
  tenantPaidRent,
  landlordProperties,
  landlordTenants,
  propertyTenants2,
  user: userData,
  tenantData,
  otherTenants,
  propertyTenants, // tenants for one property
  landlordData,
  messages,
  docs,
  loggedIn: isLoggedIn,
  broadcasts,
  sortedMessages,
  setCurrentConvo,
  messageRecipient,
  tenantsLandlord,
  sortedTenByProp: sortedTenantsByProp,
  convoPersonsName,
  receivedTransactions,
  sentTransactions
});

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer;

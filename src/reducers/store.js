import { combineReducers } from 'redux';
import { userData, tenantData, otherTenants, tenantsLandlord, landlordData, messages, docs, isLoggedIn, receivedTransactions, sentTransactions} from './reducers'
import { landlordProperties, landlordTenants } from './landlordReducer'
import { selectedTenantMedia, setCurrentConvo, messageRecipient, convoPersonsName } from './tenantReducer'
import { tenantPaidRent } from './paymentReducer'
import { broadcasts } from './broadcastsReducer'
import { sortedMessages } from './sortMesgsReducer'
import { propertyTenants, sortedTenantsByProp } from './propertyTenantsReducer'
import { propertyTenants2 } from './propertyReducer'

const rootReducer = combineReducers({
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

export default rootReducer;

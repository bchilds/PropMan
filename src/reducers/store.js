import { combineReducers } from 'redux';
import { userData, tenantData, landlordData, messages, docs, isLoggedIn} from './reducers'
import { landlordProperties, landlordTenants } from './landlordReducer';
import { selectedTenantMedia, currentConvo, messageRecipient } from './tenantReducer';
import { tenantPaidRent } from './paymentReducer'
import { broadcasts } from './broadcastsReducer'
import { sortedMessages } from './sortMesgsReducer'
import { propertyTenants } from './propertyTenantsReducer'

const rootReducer = combineReducers({
  selectedTenantMedia,
  tenantPaidRent,
  landlordProperties,
  landlordTenants,
  user: userData,
  tenantData,
  propertyTenants, // tenants for one property
  landlordData,
  messages,
  docs,
  loggedIn: isLoggedIn,
  broadcasts,
  sortedMessages,
  currentConvo,
  messageRecipient,
});

export default rootReducer;

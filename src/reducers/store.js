import { combineReducers } from 'redux';
import { userData, tenantData, otherTenants, tenantsLandlord, landlordData, messages, docs, isLoggedIn} from './reducers'
import { landlordProperties, landlordTenants } from './landlordReducer';
import { selectedTenantMedia, setCurrentConvo, messageRecipient } from './tenantReducer';
import { tenantPaidRent } from './paymentReducer'
import { broadcasts } from './broadcastsReducer'
import { sortedMessages } from './sortMesgsReducer'
import { propertyTenants, sortedTenantsByProp } from './propertyTenantsReducer'

const rootReducer = combineReducers({
  selectedTenantMedia,
  tenantPaidRent,
  landlordProperties,
  landlordTenants,
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
  sortedTenByProp: sortedTenantsByProp
});

export default rootReducer;

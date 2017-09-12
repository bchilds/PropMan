import axios from 'axios'

export const SEND_PAYMENT = 'send_payment'
export const SUBMERCHANT_CREATION = 'submerchant_creation'
export const ADD_BILL = 'add_bill'
export const BILL_SHARE_PAYMENT = 'bill_share_payment'
export const SUBMERCHANT_CREATION_FAILURE = 'submerchant_creation_failure'

const ROOT_URL = process.env.NODE_ENV === 'production' ? 'http://myrentopia.com': 'http://localhost:8000'

export function tenantPayment(payload, params, httpMethod) {
  if (httpMethod === 'post') {
    const request = axios.post(`${ROOT_URL}/api/payments/braintreePayment`, 
    {
      nonce: payload.nonce,
      transaction_amount: params.amountDue,
      sender_id: params.senderId,
      recipient_id: params.recipientId,
      payment_type: params.paymentType
    })

    return {
      type: SEND_PAYMENT,
      payload: request
    }    
  } else if (httpMethod === 'put') {
    const request = axios.put(`${ROOT_URL}/api/payments/billShare`, 
    {
      nonce: payload.nonce,
      transaction_id: params. transaction_id
    })

    return {
      type: BILL_SHARE_PAYMENT,
      payload: request
    }
  }
}

export function submerchantCreation(merchantAccountParams, userId) {
  return function(dispatch) {  
    axios.put(`${ROOT_URL}/api/payments/submerchantCreation/${userId}`, 
    {
      merchantAccountParams: merchantAccountParams
    }).then((response) => {
      dispatch({
        type: SUBMERCHANT_CREATION,
        payload: request
      })
    }).catch((error) => {
      dispatch({
        type: SUBMERCHANT_CREATION_FAILURE,
        payload: error.response
      })
    })
  }

}

export function addBill (billParams) {
  const request = axios.post(`${ROOT_URL}/api/payments/addBill`, 
  {
    payment_type: billParams.billName,
    transaction_amount: billParams.billAmount,
    requester_userId: billParams.requesterUserId,
    // sharers is an array of user ids
    sharers: billParams.sharers
  })

  return {
    type: ADD_BILL,
    payload: request
  }
}

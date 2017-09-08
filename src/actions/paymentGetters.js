import axios from 'axios'

export const SEND_PAYMENT = 'send_payment'
export const SUBMERCHANT_CREATION = 'submerchant_creation'
export const ADD_BILL = 'add_bill'
export const BILL_SHARE_PAYMENT = 'bill_share_payment'

const ROOT_URL = 'http://localhost:8000'

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
  const request = axios.put(`${ROOT_URL}/api/payments/submerchantCreation/${userId}`, 
  {
    merchantAccountParams: merchantAccountParams
  })

  return {
    type: SUBMERCHANT_CREATION,
    payload: request
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
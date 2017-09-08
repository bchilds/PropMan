import axios from 'axios'

export const SEND_PAYMENT = 'send_payment'
export const SUBMERCHANT_CREATION = 'submerchant_creation'
export const ADD_BILL = 'add_bill'

const ROOT_URL = 'http://localhost:8000'

export function tenantPayment(payload, params, httpMethod) {
  if (httpMethod === 'post') {
    const request = axios.post(`${ROOT_URL}/api/payments/braintreePayment`, 
    {
      nonce: payload.nonce,
      transaction_amount: params.amountDue,
      sender_id: params.senderId,
      recipient_id: params.recipientId,
      merchant_id: params.merchantId,
      payment_type: params.paymentType
    })

    return {
      type: SEND_PAYMENT,
      payload: request
    }    
  } else if (httpMethod === 'put') {
    console.log('lets flipping go', payload, params)
    const request = axios.put(`${ROOT_URL}/api/payments/billSplit`, 
    {
      nonce: payload.nonce,
      transaction_id: params. transaction_id
    })

    // return {
    //   type: SEND_PAYMENT,
    //   payload: request
    // }
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

  // return request
  //   .then((response) => {
  //     console.log('smC response', response)
  //     return response
  //   })
  //   .catch((err) => {
  //     console.log(err.response)
  //     return Promise.reject(err.response)
  //   })
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
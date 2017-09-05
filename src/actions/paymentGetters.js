import axios from 'axios'

export const SEND_PAYMENT = 'send_payment'
export const SUBMERCHANT_CREATION = 'submerchant_creation'

const ROOT_URL = 'http://localhost:8000'

export function tenantPayment(params) {
  const request = axios.post(`${ROOT_URL}/api/payments/payRent`, {
    nonce: params.payload.nonce,
    transaction_amount: params.rentDue,
    sender_id: params.senderId,
    recipient_id: params.recipientId,
    merchant_id: params.merchantId
  })

  return {
    type: SEND_PAYMENT,
    payload: request
  }
}

export function submerchantCreation(merchantAccountParams, landlordId) {
  const request = axios.put(`${ROOT_URL}/api/payments/submerchantCreation/${landlordId}`, {
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
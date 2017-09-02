import axios from 'axios'

export const SEND_PAYMENT = 'send_payment'

const ROOT_URL = 'http://localhost:8000'

export function tenantPayment(payment) {
  const request = axios.post(`${ROOT_URL}/api/payments/payRent`, {
    nonce: payment.nonce
  })

  return {
    type: SEND_PAYMENT,
    payload: request
  }
}

export function submerchantCreation(merchantAccountParams, landlordId) {
  console.log(`${ROOT_URL}/api/payments/submerchantCreation/${landlordId}`)
  const request = axios.put(`${ROOT_URL}/api/payments/submerchantCreation/${landlordId}`, {
    merchantAccountParams: merchantAccountParams
  })

  return request
    .then((response) => {
      console.log(response)
      return response
    })
    .catch((err) => {
      console.log(err.response)
      return Promise.reject(err.response)
    })
}
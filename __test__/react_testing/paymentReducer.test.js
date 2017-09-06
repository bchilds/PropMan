import * as paymentReducer from '../../src/reducers/paymentReducer'

describe('>>> REDUCER ---TEST paymentReducer', () => {
  describe('>>> tenantPaidRent', () => {
    it(`case 'SEND_PAYMENT' `, () => {
      let state = paymentReducer.tenantPaidRent(state, {type: 'send_payment', payload: {}})
      expect(state).toEqual(true)
    })
    it(`default`, () => {
      let state = paymentReducer.tenantPaidRent(state, {type: 'not a real case', payload: {}})
      expect(state).toEqual(false)
    })
  })
  describe('>>> receivedTransactions', () => {
    it(`case 'USER_LOGIN'`, () => {
      let action =  
        {
          type: 'user_login',
          payload: {
            data: {
              transactions: {
                sentPayments: [], 
                receivedPayments: []
              }  
            }
          } 
        }
      let state = paymentReducer.receivedTransactions(state, action)
      expect(Array.isArray(state)).toEqual(true)
    })
    it(`case 'SEND_PAYMENT`, () => {
      let action =  
        {
          type: 'send_payment',
          payload: {
            data: {
              transactions: {
                sentPayments: [], 
                receivedPayments: []
              }  
            }
          } 
        }
      let state = paymentReducer.receivedTransactions(state, action)
      expect(Array.isArray(state)).toEqual(true)
    })
  })

  describe('>>> sentTransactions', () => {
    it(`case 'USER_LOGIN'`, () => {
      let action =  
        {
          type: 'user_login',
          payload: {
            data: {
              transactions: {
                sentPayments: [], 
                receivedPayments: []
              }  
            }
          } 
        }
      let state = paymentReducer.sentTransactions(state, action)
      expect(Array.isArray(state)).toEqual(true)
    })
    it(`case 'SEND_PAYMENT`, () => {
      let action =  
        {
          type: 'send_payment',
          payload: {
            data: {
              transactions: {
                sentPayments: [], 
                receivedPayments: []
              }  
            }
          } 
        }
      let state = paymentReducer.sentTransactions(state, action)
      expect(Array.isArray(state)).toEqual(true)
    })
  })
})
import { tenantPayment, submerchantCreation } from '../../src/actions/paymentGetters'

describe('>>> ACTION --- Test paymentGetters', () => {
  it('paymentGetters tenantPayment', async () => {
    const paymentParams = {
      payload: 'fake-valid-nonce',
      rentDue: 999,
      senderId: 9,
      recipientId: 1,
      merchantId: 'rentopia'
    }

    const pay = await tenantPayment(paymentParams)
    expect(pay.type).toEqual('send_payment')
    // attempting to figure out how to test async/promises
    // expect(pay).resolves.toEqual({type: 'send_payment', payload: 'idk'})  
  })
})
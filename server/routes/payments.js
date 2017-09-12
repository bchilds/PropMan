let router = require('koa-router')()
let braintree = require('braintree')
let config = require('../../braintreeConfig.js')
let Users = require('./users.js')
let Promise = require('bluebird')
let email = require('../emailService.js')

let gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: config.MERCHANT_ID,
  publicKey: config.PUBLIC_KEY,
  privateKey: config.PRIVATE_KEY
})

const getSenderTransactions = async (ctx, tenantOrLandlord) => {
  let results = await ctx.db.query(`SELECT * FROM transactions WHERE sender_id = ${tenantOrLandlord.user_id};`)
  return results.rows
}

const getRecipientTransactions = async (ctx, tenantOrLandlord) => {
  let results = await ctx.db.query(`SELECT * FROM transactions WHERE recipient_id = ${tenantOrLandlord.user_id};`)
  return results.rows
}

const getUserTransactions = async (ctx, tenantOrLandlord) => {
  let output, sent, received
  output = {
    sentPayments: [],
    receivedPayments: []
  }
  sent = await getSenderTransactions(ctx, tenantOrLandlord)
  received = await getRecipientTransactions(ctx, tenantOrLandlord)
  // output = { sentPayments: sent }
  output.sentPayments = sent
  output.receivedPayments = received
  return output
}
exports.getUserTransactions = getUserTransactions

const createTransaction = async (ctx, paymentIdentifier, is_completed = true) => {
  let results = await ctx.db.query(`INSERT INTO transactions (payment_identifier, transaction_amount, sender_id, recipient_id, payment_type, is_completed, split_amount) VALUES ('${paymentIdentifier}', ${ctx.request.body.transaction_amount}, ${ctx.request.body.sender_id}, ${ctx.request.body.recipient_id}, '${ctx.request.body.payment_type}', ${is_completed}, ${ctx.request.body.split_amount}) RETURNING *;`)
  results = results.rows[0]
  return results
}
exports.createTransaction = createTransaction

const getTransactionById = async (ctx, transaction_id) => {
  let results = await ctx.db.query(`SELECT * FROM transactions WHERE transaction_id = ${transaction_id};`)
  results = results.rows[0]
  return results
}
exports.getTransactionById = getTransactionById

const getUserExpenses = async (ctx, user_id) => {
  let transactionData = await ctx.db.query(`SELECT payment_type, SUM(split_amount) from transactions where sender_id=${user_id} AND is_completed=true GROUP BY payment_type ORDER BY SUM(split_amount) DESC LIMIT 5;`)
  transactionData = transactionData.rows
  return transactionData
}
exports.getUserExpenses = getUserExpenses

router
  .get('/:id', async (ctx, next) => {
    let paymentRows = await getTransactionById(ctx, ctx.params.id)
    ctx.body = paymentRows
  })
  .post('/braintreePayment', async ctx => {
    // ctx.request.body = {nonce, transaction_amount, sender_id, merchant_id, payment_type, recipient_id} ID's are user_id's
    let nonceFromClient = ctx.request.body.nonce
    let landlordUserData = await Users.getUserById(ctx, ctx.request.body.recipient_id)
    let result = await gateway.transaction.sale({
      merchantAccountId: landlordUserData.merchant_id,
      amount: ctx.request.body.transaction_amount,
      paymentMethodNonce: nonceFromClient,
      options: {
        submitForSettlement: true
      },
      serviceFeeAmount: "00.00"
    })
    let paymentIdentifier = result.transaction.id
    if (result.success) {
      //create transaction record here
      console.log('creating transaction in DB')
      ctx.request.body.split_amount = ctx.request.body.transaction_amount
      let transaction = await createTransaction(ctx, paymentIdentifier)
      let newExpenses = await getUserExpenses(ctx, ctx.request.body.sender_id)
      if(transaction) {
        ctx.response.status = 201
        ctx.body = {transaction, newExpenses}
      } else {
        ctx.response.status = 400
        ctx.body = 'Error creating transaction'
      }
    }
  })
  .put('/billShare', async ctx => {
    let nonceFromClient = ctx.request.body.nonce
    let results = await getTransactionById(ctx, ctx.request.body.transaction_id)
    let merchantId = await ctx.db.query(`SELECT merchant_id FROM users WHERE user_id = ${results.recipient_id};`)
    merchantId = merchantId.rows[0].merchant_id
    if (merchantId) {    
      let result = await gateway.transaction.sale({
        merchantAccountId: merchantId,
        amount: results.transaction_amount,
        paymentMethodNonce: nonceFromClient,
        options: {
          submitForSettlement: true
        },
        serviceFeeAmount: "00.00"
      })
      let paymentIdentifier = result.transaction.id
      if (result.success) {
        //create transaction record here
        console.log('updating transaction in DB')
        let transaction = await ctx.db.query(`UPDATE transactions SET (payment_identifier, is_completed) = ('${paymentIdentifier}', true) WHERE transaction_id = ${results.transaction_id} RETURNING *;`)
        transaction = transaction.rows[0]
        let user = await Users.getUserById(ctx, results.sender_id)
        console.log(1)
        let allTransactions = await getUserTransactions(ctx, user)
        console.log(2)
        let newExpenses = await getUserExpenses(ctx, transaction.sender_id)
        console.log(3)
        if(transaction) {
          ctx.response.status = 201
          ctx.body = {allTransactions: allTransactions, newExpenses: newExpenses}
        } else {
          ctx.response.status = 400
          ctx.body = 'Error creating transaction'
        }
      }
    }
  })
  .post('/addBill', async ctx => {
    ctx.request.body.sender_id = ctx.request.body.requester_userId
    let newTransactions = []
    ctx.request.body.recipient_id = null
    let splitAmount = (ctx.request.body.transaction_amount / (ctx.request.body.sharers.length+1)).toFixed(2)  
    ctx.request.body.split_amount = splitAmount
    let transaction = await createTransaction(ctx, null)
    newTransactions.push(transaction)
    if(transaction) {
      // split the amount amongst all the users (bill sharer creator plus all sharers)
      ctx.request.body.transaction_amount = splitAmount
      ctx.request.body.split_amount = splitAmount
      // edit payment name to have '(split)'
      ctx.request.body.payment_type = `${ctx.request.body.payment_type} (bill share payment)`
      for (var sharer of ctx.request.body.sharers) {
        ctx.request.body.recipient_id = ctx.request.body.requester_userId
        ctx.request.body.sender_id = sharer 
        let transaction = await createTransaction(ctx, null, false)
        newTransactions.push(transaction)
        let user = await Users.getUserById(ctx, sharer)
        email.sendEmail(user.email, 'Rentopia - Your roommate has requested a bill share')
      }
      let newExpenses = await getUserExpenses(ctx, ctx.request.body.requester_userId)
      ctx.response.status = 201
      ctx.body = {newTransactions: newTransactions, newExpenses: newExpenses}
    } else {
      ctx.response.status = 400
      ctx.body = 'Error creating transaction'
    }
  })
  .put('/submerchantCreation/:user_id', async ctx => {
    ctx.request.body.merchantAccountParams.masterMerchantAccountId = config.MERCHANT_ACCOUNT_ID
    let merchantAccountParams = ctx.request.body.merchantAccountParams

    let result = await gateway.merchantAccount.create(merchantAccountParams)
    if (!result.success) {
      ctx.response.status = 400
      ctx.body = result.message
    } else {      
      // update the user record with the merchantAccount id using ctx.request.body.user_id  
      ctx.request.body.merchant_id = result.merchantAccount.id
      let user = await Users.updateMerchant(ctx, ctx.params.user_id)  
      if(user) {
        ctx.response.status = 201
        ctx.body = user   
      } else {
        ctx.response.status = 400
        ctx.body = 'Error updating User'
      }
    }
  })
  exports.routes = router

// module.exports = {
//   routes: router,
//   getUserTransactions: getUserTransactions,
// }

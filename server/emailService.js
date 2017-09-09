let nodemailer = require('nodemailer')
let emailConfig = require('../emailConfig.js')
let templates = require('./emailTemplates.js')
const path = require('path')
let imagePath = path.join(__dirname, '../src/images/invoice.png')

const sendEmail = async (recipient_email, subject) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: emailConfig.EMAIL_ADDRESS,
      pass: emailConfig.EMAIL_PW
    }
  })

  let mailOptions = {
    from: emailConfig.EMAIL_ADDRESS,
    to: recipient_email,
    subject: subject,
    html: templates.billShare(),
    attachments: [{
      filename: 'invoice.png',
      path: imagePath,
      cid: 'invoiceImage'
    }]
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Message sent: ' + info.response)
    }
  })
}
exports.sendEmail = sendEmail
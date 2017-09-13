let nodemailer = require('nodemailer')
let emailConfig = require('../emailConfig.js')
let templates = require('./emailTemplates.js')
const path = require('path')
let imagePath = path.join(__dirname, '../src/images/invoice.png')
let imageContract = path.join(__dirname, '../src/images/signing-the-contract.png')

const sendEmail = async (recipient_email, subject, template = {name:"billShare"}) => {
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
    html: template.name==="Document" ? templates.sendDocument(template.url) : templates.billShare(),
    attachments: [{
      filename: template.name==="Document" ? 'signing-the-contract.png' : 'invoice.png',
      path: template.name==="Document" ? imageContract : imagePath,
      cid: template.name==="Document" ? 'contractImage' : 'invoiceImage'
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

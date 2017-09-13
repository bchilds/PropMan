const path = require('path')

const billShare = () => {
  return ( 
    `
      <!DOCTYPE html>
        <html lang="en">
          <head>
            <style media="screen" type="text/css">
              html {
                background-color: rgba(218, 223, 225, 1);
                margin: 0px;
                padding: 0px;
              }
              body {
                height: 100vh
              }
              .email {
                background-color: white;
                padding: 5px;
                height: 90%;
                text-align: center;
              }
              .appName {
                margin: 0px;
                color: black;
                font-size: 40px;
                border-bottom: 1px solid black;
                text-align: center;
                padding: 0px;
              }
              .billButton {
                border: none;
                margin: 0 auto;
                background-color: rgba(42, 187, 155,1);
                font-size: 20px;
                padding: 5px;
                cursor: pointer;
                margin-bottom: 40px;
              }
              .billButton a {
                text-decoration: none;
                color: white;
              }
              .invoiceImg {
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="email">
              <div class="appName">
                <h1>rentopia</h1>
              </div>
              <div>
                <img class="invoiceImg" src="cid:invoiceImage">
                <h2> Hi! It appears that one your roommates has requested a bill split.</h2>
                <button class="billButton"><a target="_blank" href="http://localhost:8000">Pay Bill</a></button>
              </div>
            </div>
            <p>Don't want to receive emails from us? Unsubscribe <a target="_blank" href="http://localhost:8000">here</a>.</p>
            <br>
          </body>
        </html>
    `
  )
}
exports.billShare = billShare

const sendDocument = (url) => {
  return ( 
    `
      <!DOCTYPE html>
        <html lang="en">
          <head>
            <style media="screen" type="text/css">
              html {
                background-color: rgba(218, 223, 225, 1);
                margin: 0px;
                padding: 0px;
              }
              body {
                height: 100vh
              }
              .email {
                background-color: white;
                padding: 5px;
                height: 90%;
                text-align: center;
              }
              .appName {
                margin: 0px;
                color: black;
                font-size: 40px;
                border-bottom: 1px solid black;
                text-align: center;
                padding: 0px;
              }
              .billButton {
                border: none;
                margin: 0 auto;
                background-color: rgba(42, 187, 155,1);
                font-size: 20px;
                padding: 5px;
                cursor: pointer;
                margin-bottom: 40px;
              }
              .billButton a {
                text-decoration: none;
                color: white;
              }
              .invoiceImg {
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="email">
              <div class="appName">
                <h1>rentopia</h1>
              </div>
              <div>
                <a href=${url}><img class="invoiceImg" src="cid:contractImage"></a>
                <h2> Hi! Your landlord has sent you a lease. Please click the image above to view it in your browser, <a href="https://www.howtogeek.com/164668/how-to-electronically-sign-documents-without-printing-and-scanning-them/">electronically sign it</a>, and upload it to <a href="http://www.myrentopia.com/">Rentopia</a></h2>
              </div>
            </div>
            <p>Don't want to receive emails from us? Unsubscribe <a target="_blank" href="http://localhost:8000">here</a>.</p>
            <br>
          </body>
        </html>
    `
  )
}
exports.sendDocument = sendDocument

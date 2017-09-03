import React from 'react'
import { statesList, months, days, years } from './formHelperData'
import { submerchantCreation } from '../../actions/paymentGetters'

import { Accordion, Panel } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import PaymentSetupSuccess from './PaymentSetupSuccess.jsx'
import venmo from '../../images/venmo_logo.png'
import bank from '../../images/bank-icon.png'

class PaymentSetup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bankIsSelected: true,
      openModal: false,
      user: this.props.user
    }
  }

  componentWillMount() {
    // console.log(this.props.user.user_name)
    // console.log(this.props.user.email)
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log(this.props.landlordData, '1111111')
    let monthNum = months.indexOf(e.target.month.value) + 1

    let destination, accountNum, routingNum, phoneNum, venmoEmail

    if (this.state.bankIsSelected) {
      destination = 'bank'
      accountNum = e.target.accountNum.value
      routingNum = e.target.routingNum.value
      phoneNum = '',
      venmoEmail = ''
    }

    if (!this.state.bankIsSelected) {
      if (e.target.venmoEmail.value !== '') {
        destination = 'email'
      } else {  
        destination = 'mobile_phone'
      }
      accountNum = ''
      routingNum = ''
      phoneNum = e.target.phoneNum.value,
      venmoEmail = e.target.venmoEmail.value
    }

    let params = {
      individual: {
        firstName: e.target.name.value.split(' ')[0],
        lastName: e.target.name.value.split(' ')[1],
        email: e.target.email.value,
        dateOfBirth: `${e.target.year.value}-${monthNum}-${e.target.day.value}`,
        address: {
          streetAddress: e.target.street.value,
          locality: e.target.city.value,
          region: e.target.state.value,
          postalCode: e.target.zip.value
        }
      },
      funding: {
        destination: destination, // can be either bank, mobile_phone, or email
        email: venmoEmail, // for venmo
        mobilePhone: phoneNum, // for venmo
        accountNumber: accountNum, //for bank
        routingNumber: routingNum // for bank
      },
      tosAccepted: true, // need to do a terms of service thing
      masterMerchantAccountId: "" // inside of braintree.config.js
    }
    submerchantCreation(params, this.props.landlordData.landlord_id)
      .catch((err) => {
        alert(err.data)
      })
      .then((res) => {
        this.setState({
          openModal: true
        })
      })
  }

  handleOptionChange(e) {

    this.setState({
      bankIsSelected: (e.target.value === 'bank')
    })
  }

  renderStates() {
    return statesList.map((usState, i) => {
      return (
        <option key={i}> {usState} </option>
      )
    })
  }

  renderMonths() {
    return months.map((month, i) => {
      return (
        <option key={i}> {month} </option>
      )
      return (
        <div>HELLO</div>
      )
    })
  }

  renderDays() {
    return days.map((day, i) => {
      return (
        <option key={i}> {day} </option>
      )
    })
  }

  renderYears() {
    return years.map((year, i) => {
      return (
        <option key={i}> {year} </option>
      )
    })
  }

  renderBankForm() {
    return (
      <div>
        <label>Account Number</label><br/><input type="text" className="paymentInput" name="accountNum"></input><br/>
        <label>Routing Number</label><br/><input type="text" className="paymentInput" name="routingNum"></input><br/>
      </div>
    )
  }

  renderVenmoForm() {
    return (
      <div>
        <label>Email</label><br/><input className="paymentInput" name="venmoEmail"></input><br/>
        <label>Phone Number</label><br/><input type="text" className="paymentInput" name="phoneNum"></input><br/>
        <h6>* Must have a valid Venmo account</h6>
        <h6>* Please use either the email or phone number associated with your Venmo account</h6>
      </div>
    )
  }

  render() {
    return (
      <div className="paymentSetup">
        <h2 className="methodTitle">Set up my payment method</h2>
          <form className="paymentSetupForm" onSubmit={this.handleSubmit.bind(this)}>
            <Accordion>
              <Panel header="1. Personal Information" eventKey="1">
                <label>Full Name</label><br/><input name="name" className="paymentInput" defaultValue={this.state.user.user_name}></input><br/>
                <label>E-mail address</label><br/><input name="email" className="paymentInput" defaultValue={this.state.user.email}></input><br/>
                <label>Birthday</label><br/>
                <select name="month">
                  {this.renderMonths()}
                </select>
                <select name="day">
                  {this.renderDays()}
                </select>
                <select name="year">
                  {this.renderYears()}
                </select>
              </Panel>
              <Panel header="2. Address" eventKey="2">
                <label>Street Address</label><br/><input name="street" className="paymentInput"></input><br/>
                <label>City</label><br/><input name="city" className="paymentInput"></input><br/>
                <label>State</label><br/>
                <select name="state" className="statesSelect">
                  {this.renderStates()}
                </select>
                <br/>
                <label>Zip Code</label><br/><input name="zip" type="text" className="paymentInput"></input><br/>
              </Panel>
              <Panel className="fundingPanel" header="3. Funding Information" eventKey="3">
                  <h5>Select your desired payment method</h5>
                  <div className="paymentOption">
                    <label>
                      <img src={bank} /><br/>
                      <input className="paymentOption"
                        type="radio" 
                        value="bank" 
                        checked={this.state.bankIsSelected} 
                        onChange={this.handleOptionChange.bind(this)}>
                      </input>
                    </label>
                  </div>
                  <div className="paymentOption">
                    <label>
                      <img className="venmo" src={venmo} /><br/>
                      <input className="paymentOption"
                        type="radio" 
                        value="venmo" 
                        checked={!this.state.bankIsSelected}
                        onChange={this.handleOptionChange.bind(this)}>
                      </input>
                    </label>
                  </div>
                  <div>{this.state.bankIsSelected && this.renderBankForm()}</div>
                  <div>{!this.state.bankIsSelected && this.renderVenmoForm()}</div>
              </Panel>
            </Accordion>
            <div className="paymentSetupSubmit">
              <span>By clicking submit, you agree to our <Link target="_blank" to='/termsofservice' className="link">Terms of Service </Link></span>
              <button type="submit"> Submit</button>
            </div>
          </form>
          {this.state.openModal && <PaymentSetupSuccess />}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    landlordData: state.landlordData
  }

}

export default connect(mapStateToProps, null)(PaymentSetup)

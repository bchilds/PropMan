import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import braintree from 'braintree-web-drop-in'
import PropTypes from 'prop-types'
import BraintreeDropin from 'braintree-dropin-react'
import { TOKENIZATION_KEY } from '../../../braintreeConfig'
import { tenantPayment } from '../../actions/paymentGetters'

const renderSubmitButtonShow = ({onClick, isDisabled, text}) => {
  return (
      <button onClick={onClick} disabled={isDisabled}>Pay</button>
  )
}

const renderSubmitButtonHide = ({onClick, isDisabled, text}) => {
  return (
    <div onClick={onClick} disabled={isDisabled}></div>
  )
}

renderSubmitButtonShow.propTypes = {
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}

renderSubmitButtonHide.propTypes = {
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}

class PaymentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPayRentButton: true
    }
  }

  handlePaymentMethod(payload) {
    this.props.tenantPayment({
      payload: payload, 
      amountDue: this.props.paymentParams.amountDue, 
      senderId: this.props.paymentParams.senderId, 
      recipientId: this.props.paymentParams.recipientId, 
      merchantId: this.props.paymentParams.merchantId,
      paymentType: this.props.paymentParams.paymentType
    }
    )
    this.setState({
      showPayRentButton: false
    })
    // send payload aka nonce to server. 
    // server should use nonce with a braintree sdk to charge card
  }

  reshowSubmitButton() {
    this.setState({
      showPayRentButton: true
    })
  }

  render () {

    if (this.state.showPayRentButton) { 
      return (
        <div className="paymentForm">
          <BraintreeDropin
            braintree={braintree}
            authorizationToken={TOKENIZATION_KEY}
            handlePaymentMethod={this.handlePaymentMethod.bind(this)}
            renderSubmitButton={renderSubmitButtonShow}
          />
        </div>
      )
    }
    else {
      return (
        <div className="paymentForm">
          <BraintreeDropin
            braintree={braintree}
            authorizationToken={TOKENIZATION_KEY}
            handlePaymentMethod={this.handlePaymentMethod.bind(this)}
            renderSubmitButton={renderSubmitButtonHide}
            reshowSubmitButton={this.reshowSubmitButton.bind(this)}
          />
        </div>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    tenantData: state.tenantData,
    tenantsLandlord: state.tenantsLandlord
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({tenantPayment: tenantPayment}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentForm)
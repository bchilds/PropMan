import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TenantSidebar from './TenantSidebar.jsx';
import PaymentForm from '../Payment/PaymentForm.jsx';
import Modal from 'react-modal';
import { getBroadcasts } from '../../actions/broadcastsGetter'
import { getTransactionData } from '../../actions/paymentGetters'
import { bindActionCreators } from 'redux';
// import { bindActionCreators } from 'redux';
import DonutWindow from '../Payment/DonutWindow.jsx'

const customStyles = {
  content : {
    top             : '50%',
    left            : '50%',
    right           : '70%',
    bottom          : 'auto',
    marginRight     : '-50%',
    transform       : 'translate(-50%, -50%)',
    maxHeight       : '500px', // This sets the max height
    maxWidth        : '700px',
    overflow        : 'scroll', // This tells the modal to scroll
    border          : '1px solid black',
    //borderBottom          : '1px solid black', // for some reason the bottom border was being cut off, so made it a little thicker
    borderRadius    : '0px'
  }
};


class TenantDashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalIsOpen: true,
      showDonut: true,
      donutData: [],
    }
  }

  componentWillMount() {
    this.props.getBroadcasts(this.props.tenantData.property_id)
    this.setState({
      donutData: this.props.expenses
    })
  }

  componentDidMount() {
    this.setState({
      modalIsOpen: false
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      donutData: nextProps.expenses
    })

    if (nextProps.media) {
      this.setState({
        showDonut: false
      })
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  showDonut() {
    this.setState({
      showDonut: true
    })
  }

  render() {
  	return (
      <div>
        <TenantSidebar tenant_id={this.props.tenantData.tenant_id} showDonut={this.showDonut.bind(this)} />

        <div id="tenantWindow">
          <h2 className="pageTitle"> Your Dashboard </h2>
          {this.state.showDonut && <div className="donutGraph">
            <h3>Expenses</h3>
            <DonutWindow data = {this.state.donutData}
            />
          </div>
          }
          {!this.state.showDonut &&           
            <div className="selectedMedia">
              <h3> {this.props.media.title} </h3>
              <p> {this.props.media.media} </p>
            </div>
          }
        </div>

        <div id="centerTenantDash">
          <p className="tenantMakePayment">
          <p>Rent Due: {this.props.tenantRentDue}</p>
            <button className="btn btn-secondary" onClick={this.openModal.bind(this)}> Make Payment </button>
          </p>
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          style={customStyles}
          contentLabel="Payment Modal"
        > 
          <PaymentForm paymentParams=
            {
              {
                amountDue: this.props.tenantData.rent, 
                senderId: this.props.user.user_id, 
                recipientId: this.props.tenantsLandlord.user_id, 
                merchantId: this.props.tenantsLandlord.merchant_id,
                paymentType: 'Rent',
                httpMethod: 'post'
              }
            }/>
        </Modal>
      </div>
  	)
  }
}

function mapStateToProps(state) {
	return {
		tenantRentDue: state.tenantData && state.tenantData.rent,
    media: state.selectedTenantMedia,
    tenantData: state.tenantData,
    user: state.user,
    tenantsLandlord: state.tenantsLandlord,
    expenses: state.expenses
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getBroadcasts}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TenantDashboard)


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
// import Dimensions from 'react-dimensions'
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
  constructor() {
    super()

    this.state = {
      modalIsOpen: true,
      showDonut: true
    }
  }
  
  componentWillReceiveProps(nextProps) {
    console.log('donuts are yummy')
    getTransactionData(nextProps.user.user_id)
    this.props.getBroadcasts(nextProps.tenantData.property_id)
  }

  componentDidMount() {
    this.setState({
      modalIsOpen: false
    })
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
  	return (
      <div>
        <TenantSidebar 
          containerWidth={this.props.containerWidth}
          containerHeight={this.props.containerHeight}
        />

        <div id="tenantWindow">
          <h2 className="pageTitle"> Your Dashboard </h2>
          {this.state.showDonut && <div className="donutGraph">
            <h3>Monthly Expenses</h3>
            <DonutWindow data = {
              [
                {
                  label: 'Rent',
                  value: 780
                },
                {
                  label: 'Utilities',
                  value: 110
                },
                {
                  label: 'Internet',
                  value: 60
                },
                {
                  label: 'Gas',
                  value: 30
                }
              ]
            }
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
    tenantsLandlord: state.tenantsLandlord
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getBroadcasts}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TenantDashboard)


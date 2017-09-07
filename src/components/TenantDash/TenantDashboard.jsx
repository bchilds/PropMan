import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TenantSidebar from './TenantSidebar.jsx';
import PaymentForm from '../Payment/PaymentForm.jsx';
import Modal from 'react-modal';
import { getBroadcasts } from '../../actions/broadcastsGetter'
import { bindActionCreators } from 'redux';

// import { bindActionCreators } from 'redux';
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
    }
  }

  componentWillMount() {
    this.props.getBroadcasts(this.props.tenantData.property_id)
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
        <h2 className="pageTitle"> Your Dashboard </h2>
        <TenantSidebar />

        <div id="tenantWindow">
          <h3> Header </h3>
          <p> {this.props.media} </p>
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
          <PaymentForm paymentType={'Rent'}/>
        </Modal>
      </div>
  	)
  }
}

function mapStateToProps(state) {
	return {
		tenantRentDue: state.tenantData && state.tenantData.rent,
    media: state.selectedTenantMedia,
    tenantData: state.tenantData
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getBroadcasts}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TenantDashboard)


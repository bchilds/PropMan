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
      mobile: false,
      showDonut: true,
      donutData: [],
      showMedia: false,
      paymentAction: "Make Payment"
    }
  }

  componentWillMount() {
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;  
    var mobile = false;
    if (x < 481) {
      mobile = true
    }
    this.setState({
      donutData: this.props.expenses,
      mobile: mobile,
      modalIsOpen: true
    })
  }

  componentDidMount() {
    this.setState({
      modalIsOpen: false
    })
  }

  componentWillReceiveProps(nextProps) {
    !!this.props.tenantData.property_id ? this.props.getBroadcasts(this.props.tenantData.property_id) : null
    this.setState({
      donutData: nextProps.expenses
    })
  }

  openModal() {
    if (this.state.mobile) {
      this.setState({modalIsOpen: true, showDonut: false, showMedia: false, paymentAction: "Cancel"});
    } else {
      this.setState({modalIsOpen: true, paymentAction: "Cancel"});
    }
  }

  closeModal() {
    this.setState({modalIsOpen: false, showDonut: true, paymentAction: "Make Payment"});
  }

  cancelPayment() {
    this.closeModal()
    this.setState({paymentAction: "Make Payment"})
  }

  togglePayment() {
    this.setState({modalIsOpen: false, showDonut: true, paymentAction: "Make Payment"})
  }

  render() {
    return (

      <div className="container-fluid">
        <div className="row">
          <div  className="col-lg-3 col-md-4 col-sm-12 col-xs-12 messageMargins">
            <TenantSidebar/>
          </div>  
          <div className="col-lg-9 col-md-8 col-sm-12 col-xs-12 messageMargins">
            <div id="tenantWindow">
              {this.state.mobile && this.state.modalIsOpen &&
                <PaymentForm togglePayment={this.togglePayment.bind(this)} 
                  paymentParams=
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
              }
              
              {this.props.showDonut && 
                <div className="donutGraph">
                  <h3>Monthly Expenses</h3>
                  <DonutWindow data = {this.props.expenses}/>
                </div>
              }

              {!this.props.showDonut &&           
                <div className="selectedMedia">
                  <h3 className="broadcastTitle">Broadcasts</h3>
                  <h2> {this.props.media.title} </h2>
                  <p> {this.props.media.media} </p>
                </div>
              }

              <div className="col-lg-12">
                <p className="tenantMakePayment">
                <p>Rent Due: {this.props.tenantRentDue}</p>
                { this.state.paymentAction === "Make Payment" ?
                  <button className="btn btn-secondary" onClick={this.openModal.bind(this)}> Make Payment </button>
                  :<button className="btn btn-secondary" onClick={this.cancelPayment.bind(this)}> Cancel </button>
                }
                </p>
                {!this.state.mobile && this.state.modalIsOpen &&
                <Modal
                  isOpen={this.state.modalIsOpen}
                  onRequestClose={this.closeModal.bind(this)}
                  style={customStyles}
                  contentLabel="Payment Modal"
                > 
                  <PaymentForm togglePayment={this.togglePayment.bind(this)}
                  paymentParams=
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
              }
              </div>

            </div>
          </div>
      </div>
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
    expenses: state.expenses,
    showDonut: state.showDonut
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getBroadcasts}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TenantDashboard)


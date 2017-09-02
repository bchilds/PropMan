import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import TenantSidebar from './TenantSidebar.jsx';
import PaymentForm from '../Payment/PaymentForm.jsx';
import MessageSidebar from './MessagesSidebar.jsx';
import Modal from 'react-modal';
import { sendMessage } from '../../actions/messageGetters';
import { sortMessages } from '../../actions/sortMessages';

// import { bindActionCreators } from 'redux';
const customStyles = {
  content : {
    top             : '50%',
    left            : '50%',
    right           : '70%',
    bottom          : 'auto',
    marginRight     : '-50%',
    transform       : 'translate(-50%, -50%)',
    maxHeight       : '600px',
    minHeight       : '400px', // This sets the max height
    width           : '600px',
    overflow        : 'scroll', // This tells the modal to scroll
    border          : '1px solid black',
    //borderBottom          : '1px solid black', // for some reason the bottom border was being cut off, so made it a little thicker
    borderRadius    : '0px'
  }
};

const hvrDesrpCDN = 'https://stackoverflow.com/questions/3559467/description-box-on-mouseover'

class TenantMessages extends Component {
  constructor() {
    super()

    this.state = {
      modalIsOpen: false,
      sendTo: -1
    }
    this.handleSendTo = this.handleSendTo.bind(this)
  }

  componentDidMount() {
  	this.props.sortMessages(this.props.messages, this.props.userId)
    this.setState({
      modalIsOpen: false
    })
  }

  handleSendTo(e) {
  	e.preventDefault()
  	if (this.props.mesgRecipient === null) {
  		alert('Must add recipient before sending you big dummy!')
  	}
  	var obj = {
  		content: e.target.message.value,
  		recipId: this.props.mesgRecipient,
  		userId: this.props.userId
  	}
  	this.props.sendMessage(obj) //needs names
  }

  renderConvo() {
  	// *** Sender_id needs to be the actual sender. That will be set up with a get request
  	return (
  		<tbody>
  		  {this.props.currentConvo.map(v => {
	  		  	if (v.sender_id === this.props.userId) {
	  		  	  return (<div className="messageRight" ><div className="mesRight">{v.message_content}</div></div>)
	  		    } else {
	  		    	return (<div className="messageLeft"><div className="mesLeft">{v.message_content}</div></div>)
	  		    }
	  		  }
  		  )}
  		</tbody>
  	)
  }

  render() {
  	return (
      <div>
        <h2 className="pageTitle"> Your Messages </h2>
        <MessageSidebar />

        <div id="tenantWindow">
          <table className="table table-hover">{this.renderConvo()}</table>
        </div>
	      <div className="newMessage">
	        <form onSubmit={this.handleSendTo.bind(this)}>
	  				<input className="centerMessage" type="text" name="message" placeholder="Type in me!"/>
	        </form>
	      </div>
      </div>
  	)
  }
}

function mapStateToProps(state) {
	return {
		tenantRentDue: state.tenantData && state.tenantData.rent,
		propTenants: [{email: 'empty', tenant_id: 5}], //state.tenantData && state.tenantData.tenants
    media: state.selectedTenantMedia,
    email: state.user && state.user.email,
    userId: state.user && state.user.user_id,
    messages: [],
    currentConvo: state.currentConvo,
    mesgRecipient: state.messageRecipient,
    userId: state.user && state.user.user_id,
    userName: state.user && state.user.user_name
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({sendMessage, sortMessages}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TenantMessages)


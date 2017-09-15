import React, { Component } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import TenantSidebar from './TenantSidebar.jsx';
import PaymentForm from '../Payment/PaymentForm.jsx';
import MessageSidebar from './MessagesSidebar.jsx';
import Modal from 'react-modal';
import { sendMessage } from '../../actions/messageGetters';
import { sortMessages, setCurrentConvo } from '../../actions/sortMessages';

const hvrDesrpCDN = 'https://stackoverflow.com/questions/3559467/description-box-on-mouseover'

class TenantMessages extends Component {
  constructor() {
    super()
    
    this.handleSendTo = this.handleSendTo.bind(this)
  }

  setScrollToBottom() {
    var myDiv = document.getElementById('messagesWindow');
    myDiv.scrollTop = myDiv.scrollHeight;
  }

  componentDidMount() {
    this.props.sortMessages(this.props.messages, this.props.userId)
    this.setScrollToBottom()
    this.setState({
      modalIsOpen: false,
      convoPerson: ''
    })
  }

  componentWillReceiveProps() {
    setTimeout(() => {this.setScrollToBottom()}, 0)
  }

  handleSendTo(e) {
  	e.preventDefault()
  	if (this.props.mesgRecipient === null) {
  		alert('Must add recipient before sending you big dummy!')
  	} else {
	  	var obj = {
	  		message_content: e.target.message.value,
	  		recipient_id: this.props.mesgRecipient,
	  		sender_id: this.props.userId
	  	}
  	  e.target.message.value = ''
  	  this.props.sendMessage(obj)
  	    .then(() => {
  	    	this.props.sortMessages(this.props.messages, this.props.userId)
  	    })
  	    .then(()=>{
  	    	var recip = this.props.mesgRecipient
  	    	this.props.setCurrentConvo(this.props.sortedMesgs[recip], recip, this.props.convoPersonsName)
          this.setScrollToBottom()
  	    })
    }
  }

  messageContent(content, date, side, sideFull, style, i) {
    if (date === "Invalid Date") {
      date = ''
    }
    return (
      <div id={sideFull} key={i}>
        <div className={style}>{date}</div>
        <div className={side}>{content}</div>
      </div>
    )
  }

  render() {
  	return (
        <div className="container-fluid messageMargins">
            <div className="row ">
              <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 messageMargins">
                <MessageSidebar/>
              </div>
              <div className="col-lg-9 col-md-8 col-sm-12 col-xs-12 messageMargins">
                <div className="convoPersName"><h3>{this.props.convoPersonsName}</h3></div>
                <div id="messagesWindow">
                  { this.props.currentConvo.length === 0 &&
                    <h3 className="pickAConvo">Choose a conversation</h3>
                  }
                  {this.props.currentConvo.map((v, i) => {
                      var date = new Date(v.created_date).toLocaleDateString()
                      if (v.sender_id === this.props.userId) { 
                        return this.messageContent(v.message_content, date, 'mesRight', 'messageRight', 'mesRight dateStyle', i)
                      } else {
                        return this.messageContent(v.message_content, date, 'mesLeft', 'messageLeft', 'mesLeft dateStyle', i)
                      }
                    }
                  )}
                </div>
                <div className="newMessage">
                  <form onSubmit={this.handleSendTo.bind(this)}>
                    <input className="centerMessage" type="text" name="message" placeholder="Type in me!"/>
                  </form>
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
		propTenants: [{email: 'empty', tenant_id: 5}], //state.tenantData && state.tenantData.tenants
    media: state.selectedTenantMedia,
    email: state.user && state.user.email,
    userId: state.user && state.user.user_id,
    messages: state.messages,
    currentConvo: state.setCurrentConvo,
    mesgRecipient: state.messageRecipient,
    userId: state.user && state.user.user_id,
    userName: state.user && state.user.user_name,
    sortedMesgs: state.sortedMessages,
    landlordId: state.landlordData && state.landlordData.landlord_id,
    landlordTenants: state.landlordTenants,
    convoPersonsName: state.convoPersonsName
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({sendMessage, sortMessages, setCurrentConvo}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TenantMessages)


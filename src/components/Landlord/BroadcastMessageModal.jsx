import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import { sendBroadcast } from '../../actions/messageGetters';

const hvrDesrpCDN = 'https://stackoverflow.com/questions/3559467/description-box-on-mouseover'

class BroadcastModal extends Component {
  constructor() {
    super()

    this.handleSendTo = this.handleSendTo.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.deleteMessage = this.deleteMessage.bind(this)
  }

  handleSendTo(e) {
  	this.setState({sendTo: e})
  }

  sendMessage() {
  	var obj = {
      property_id: this.props.propertyId,
	  	title: document.getElementById('broadcastTitle').value,
	  	message_content: document.getElementById('messageTextInput').value
    }
  	this.props.sendBroadcast(obj)
      .then((response) => {
        if (typeof response.payload.data !== 'string') {
          this.props.onRequestClose()
        } else {
          alert('There was an error sending your broadcast.')
        }
      })
  }

  deleteMessage() {
  	document.getElementById('messageTextInput').value = ''
    document.getElementById('broadcastTitle').value = ''
    this.props.onRequestClose()
  }

  render() {
  	return (
  		<div>
    	  <button href="`${hvrDesrpCDN}`" title="Send message" className="messageIcons"  onClick={this.sendMessage} className="messageIcons"><i className="fa fa-paper-plane-o fa-fw" aria-hidden="true"></i></button>
    	  <button href="`${hvrDesrpCDN}`" title="Throw this dank message in the trash!" className="messageIcons" onClick={this.deleteMessage} className="messageIcons"><i className="fa fa-trash-o fa-fw" aria-hidden="true"></i></button>
        <br/>
        <label> Title </label>
        <br/>
        <input type="text" id="broadcastTitle"/><br/>
    		<textarea onKeyPress={this.keyPress} id="messageTextInput" className="messageInput" rows="15" cols="60" />
      </div>
  	)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({sendBroadcast}, dispatch)
}

export default connect(null, mapDispatchToProps)(BroadcastModal)


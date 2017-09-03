import React from 'react'
import { Link } from 'react-router-dom'

import Modal from 'react-modal';

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

class PaymentSetupSuccess extends React.Component {
  constructor() {
    super()

    this.state = {
      modalIsOpen: true,
    }
  }

  componentDidMount() {
    this.setState({
      modalIsOpen: true
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
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal.bind(this)}
        style={customStyles}
        contentLabel="Payment Setup Success Modal"
      > 
        <Link to='/proprietor'>Return to dashboard</Link>
      </Modal>
    )
  }
}

export default PaymentSetupSuccess

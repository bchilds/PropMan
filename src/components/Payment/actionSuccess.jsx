import React from 'react'
import { Link } from 'react-router-dom'

import Modal from 'react-modal';
import checkMark from '../../images/checkMark.png'

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
    //borderBottom          : '1px solid black', // for some reason the bottom border was being cut off, so made it a little thicker
    borderRadius    : '0px',
    padding         : '0px'
  }
};

class ActionSuccess extends React.Component {
  constructor(props) {
    super(props)

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
        <div className="actionSuccessUpper">
          <img src={checkMark}/>
        </div>
        <div className="actionSuccessLower">
          <h4>Great!</h4>
          <h6>{this.props.message}</h6>
          <Link to={this.props.redirectLink}>Return to dashboard</Link>
        </div>
      </Modal>
    )
  }
}

export default ActionSuccess

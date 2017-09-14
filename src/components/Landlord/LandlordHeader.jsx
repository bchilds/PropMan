import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { connect} from 'react-redux'
import { bindActionCreators } from 'redux'

import { logoutUser } from '../../actions/authGetters'

class Header extends Component {
    constructor(props) {
    super() 

    this.state = {
      dropdownIsOpen: false
    }
  }

  toggleDropdown() {
    this.setState({ dropdownIsOpen: !this.state.dropdownIsOpen }
  )}

  handleLogout() {
    this.props.logoutUser()
      .then(() => {
        this.props.history.push('/')
      })
  }
  render() {
    return (
      <div className="navbarColor">
        <nav className="navbar navbar-expand-lg navbar-dark">

          <Link className="navbar-brand" id="navbarText" to="/proprietor">Rentopia</Link>

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
              aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link" id="navbarText" to="/proprietor/properties">Properties<span className="sr-only">(current)</span></Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" id="navbarText" to="/proprietor/tenants">Tenants</Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" id="navbarText" to="/proprietor/payments">Payments</Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" id="navbarText" to="/proprietor/messages">Messages</Link>
              </li>
            </ul>
            
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.props.username}</a>
              <div className="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
                <Link className="dropdown-item" to="/proprietor/profile">Your Profile</Link>
                <Link className="dropdown-item" onClick={this.handleLogout.bind(this)} to="/" >Log Outta Here</Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }
};

function mapStateToProps(state) {
  return {
    username: state.user && state.user.user_name
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({logoutUser}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header))

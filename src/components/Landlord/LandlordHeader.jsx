import React, { Component } from 'react'
import { Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap'
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
      <Navbar className="navbar" inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand className="brand">
            <Link to="/proprietor">Rentopia</Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <LinkContainer to='/proprietor/properties' className="link">
            <NavItem>Properties</NavItem>
          </LinkContainer>
          <LinkContainer to='/proprietor/tenants' className="link">
            <NavItem>Tenants</NavItem>
          </LinkContainer>
          <LinkContainer to='/proprietor/payments' className="link">
            <NavItem>Payments</NavItem>
          </LinkContainer>
          <LinkContainer to='/proprietor/messages' className="link">
            <NavItem>Messages</NavItem>
          </LinkContainer>
        </Nav>
        <Nav pullRight>
          <NavDropdown title="Profile/Logout" id="nav-dropdown" onToggle={this.toggleDropdown.bind(this)} open={this.state.dropdownIsOpen}>
            <LinkContainer onClick={this.toggleDropdown.bind(this)} className="dropDownMenu" to="/proprietor/profile"> 
              <NavItem>Your Profile</NavItem>
            </LinkContainer>
            <LinkContainer href="javascript:void(0)" className="dropDownMenu" onClick={this.handleLogout.bind(this)} to="/" >
              <NavItem>Logout</NavItem>
            </LinkContainer>
          </NavDropdown>
        </Nav>
      </Navbar>
    )
  }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({logoutUser}, dispatch)
}

export default connect(null, mapDispatchToProps)(withRouter(Header))

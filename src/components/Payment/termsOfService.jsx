import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

class TermsOfService extends React.Component {

  render() {
    return(
      <div>
        <Navbar className="navbar" inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand className="brand">
              <Link to="/">Rentopia</Link>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <div className="termsOfService">
          <p>Rentopia uses Braintree, a division of PayPal, Inc. (Braintree) for
          payment processing services. By using the Braintree payment processing services you
          agree to the Braintree Payment Services Agreement available at
          <a target="_blank" href="https://www.braintreepayments.com/legal/gateway-agreement"> https://www.braintreepayments.com/legal/gateway-agreement</a>, and the
          applicable bank agreement available at
          <a target="_blank" href="https://www.braintreepayments.com/legal/bank-agreement"> https://www.braintreepayments.com/legal/bank-agreement</a>.
          Also, you have to like turtles.
          </p>
        </div>

      </div>
    )
  }
}

export default TermsOfService
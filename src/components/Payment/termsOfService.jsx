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
          <h2>Terms of Service</h2>
          <p>Rentopia uses Braintree, a division of PayPal, Inc. (Braintree) for
          payment processing services. By using the Braintree payment processing services you
          agree to the Braintree Payment Services Agreement available at
          <a target="_blank" href="https://www.braintreepayments.com/legal/gateway-agreement"> https://www.braintreepayments.com/legal/gateway-agreement</a>, and the
          applicable bank agreement available at
          <a target="_blank" href="https://www.braintreepayments.com/legal/bank-agreement"> https://www.braintreepayments.com/legal/bank-agreement</a>.
          Also, you have to like turtles.
          </p>
        </div>
        <div className="credits">
          <h2>Credits</h2>
          <div>Check mark icon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
          <div>Bill icon made by <a href="https://www.flaticon.com/authors/tomas-knop" title="Tomas Knop">Tomas Knop</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
          <div>PDF Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
        </div>
      </div>
    )
  }
}

export default TermsOfService

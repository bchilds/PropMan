import React from 'react'
import { Switch, Route } from 'react-router-dom'
import SplashNavBar from './SplashNavBar.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import LandlordMain from '../Landlord/LandlordMain.jsx'
import TenantMain from '../TenantDash/TenantMain.jsx'
import PaymentSetup from '../Payment/PaymentSetup.jsx'
import TermsOfService from '../Payment/TermsOfService.jsx'

class Splash extends React.Component {

  render() {
    return (
      <div>
        <main>
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/signup' component={Signup} />
            <Route path='/proprietor' component={LandlordMain} />
            <Route path='/tenant' component={TenantMain} />
            <Route path='/termsofservice' component={TermsOfService} />
          </Switch>
        </main>
      </div>
    )
  }
}

export default Splash

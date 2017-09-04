import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, Redirect } from 'react-router-dom'

import { signupUser, loginUser } from '../../actions/authGetters'

class Signup extends React.Component {

  handleSignup(e) {
    e.preventDefault()
    let isLandlord = (e.target.userType.value === 'landlord')
    signupUser({
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      isLandlord: isLandlord        
    }, (res, data) => {
      if (res) {
        this.props.loginUser({
          email: data.email,
          password: data.password
        })
      } else { alert('failure to login upon signup')}
    })

    e.target.name.value = ''
    e.target.email.value = ''
    e.target.password.value = ''
  }

  render() {
    return (
      <div className="splash">
        <button className="redirectButton"><Link to='/' className="link">Log in</Link></button>
        <div className="signupFormParent">
          <h1>Rentopia</h1>
          <div className="signupFormChild">
            <form onSubmit={this.handleSignup.bind(this)}>
              <input className="signupInput" name="name" placeholder="Full Name"></input>
              <input className="signupInput" name="email" placeholder="Email"></input>
              <input className="signupInput" name="password" type="password" placeholder="Password"></input>
              <div className="signupSelect">
                <select name="userType">
                  <option value="landlord">Landlord</option>
                  <option value="tenant">Tenant</option>
                </select>
              </div>
              <button className="signupButton" type="submit">Create Account</button>
            </form>
          </div>
        </div>
        {this.props.loggedIn ? (this.props.isLandlord ? <Redirect to="/proprietor" /> : <Redirect to="/tenant" />) : null}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLandlord: state.user && state.user.is_landlord,
    loggedIn: state.loggedIn
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loginUser}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)


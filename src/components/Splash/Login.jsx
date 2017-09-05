import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, Redirect } from 'react-router-dom'

import { loginUser, checkSession } from '../../actions/authGetters'

class Login extends React.Component {

  handleLogin(e) {
    e.preventDefault()
    this.props.loginUser({
      email: e.target.email.value,
      password: e.target.password.value
    })

    e.target.email.value = ''
    e.target.password.value = ''
  }

  render() {
    return (
      <div className="splash">
        <button className="redirectButton"><Link to='/signup' className="link">Sign up</Link></button>
        <br/>
        <div className="loginFormParent">
          <h1>Rentopia</h1> 
          <div className="loginFormChild">
            <form onSubmit={this.handleLogin.bind(this)}>
              <input className="loginInput" name="email" placeholder="Email"></input>
              <input className="loginInput" name="password" type="password" placeholder="Password"></input>
              <button className="loginButton" type="submit">Log in</button>
            </form>
          </div>
        </div>
          {this.props.isLoggedIn && (this.props.isLandlord ? <Redirect to="/proprietor" /> : <Redirect to="/tenant" />)}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLandlord: state.user && state.user.is_landlord,
    isLoggedIn: state.loggedIn
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loginUser}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

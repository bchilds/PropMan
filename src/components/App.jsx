import React from 'react'
// import landlord main component
// import tenant main component
import Splash from './Splash/SplashMain.jsx'
import { getMessages, getDocs, getRentDue } from '../actions/tenantDashboardGetters';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist'


class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount () {
    persistStore(this.props.store, () => {
      this.setState({ rehydrated: true })
    })
  }

  render() {
    return(
      <div>
        <Splash />
      </div>
    )
  }
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({getMessages, getDocs, getRentDue}, dispatch)
// }

export default App

// export default connect(null, mapDispatchToProps)(App) 

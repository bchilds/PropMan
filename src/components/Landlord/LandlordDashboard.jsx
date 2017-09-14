
import React from 'react'
import { connect } from 'react-redux'

import Header  from './LandlordHeader.jsx'
import Properties  from './LandlordProperties.jsx'
import Property  from './LandlordPropertyComponent.jsx'
import Tenants  from './LandlordTenants.jsx'
import Profile from '../UserProfile/UserProfile.jsx'
import MapContainer from './LandlordMapContainer.jsx'


class LandlordDashboard extends React.Component {

  constructor(props) {
    super()
  }

  render() {
    return (
      <div>
        <h2 className="pageTitle"> Manage your estate </h2>
        <p> {this.props.media} </p>
        <MapContainer history={this.props.history}/>  
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    media: state.selectedLandlordMedia
  }
}

export default connect(mapStateToProps)(LandlordDashboard)

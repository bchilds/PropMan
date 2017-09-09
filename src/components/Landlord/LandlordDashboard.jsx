
import React from 'react'
import { Switch, Route } from 'react-router-dom'
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
    this.uluru = {lat: -25.363, lng: 131.044};
    // let map = new google.maps.Map(document.getElementById('g-map'), {zoom: 4, center: this.uluru})
    // let marker = new google.maps.Marker({position: this.uluru, map: map})
  }

  render() {
    return (
      <div>
        <h2> Manage your estate </h2>
        <p> {this.props.media} </p>
        <MapContainer/>
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

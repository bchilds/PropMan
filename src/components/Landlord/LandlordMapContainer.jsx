import React from 'react'
import { GoogleApiWrapper } from 'google-maps-react';
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import SimpleMap from './LandlordMap.jsx'
import Marker from './LandlordMarker.js'

export class MapContainer extends React.Component {

	constructor(props){
		super()
	}

	render() {
		const pos = {lat: 37.759703, lng: -122.428093}
		return (
			<div>
				<SimpleMap google={this.props.google}>
					<Marker />
				</SimpleMap>
			</div>
		)
	}
  
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyBsMMjEedsvvYmcMhEOdQwzKR5UD1Mm_sg',
	libraries: ['places'],
	version: '3'
}) (MapContainer)
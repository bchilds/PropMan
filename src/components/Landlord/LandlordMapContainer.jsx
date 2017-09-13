import React from 'react'
import { GoogleApiWrapper } from 'google-maps-react';
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import SimpleMap from './LandlordMap.jsx'
import Marker from './LandlordMarker.js'
import { connect } from 'react-redux'

export class MapContainer extends React.Component {

	constructor(props){
		super()
	}

	render() {
		return (
			<div>
				<SimpleMap google={this.props.google} centerAroundCurrentLocation={true}>
					{this.props.properties.map(p => {
						let pos = {
							lat: p.lat,
							lng: p.lng
						}
						return <Marker position={pos}/>
					})}
				</SimpleMap>
			</div>
		)
	}
  
}

function mapStateToProps(state) {
	return {
		properties: state.landlordProperties
	}
}

export default connect(mapStateToProps) (GoogleApiWrapper({
	apiKey: 'AIzaSyBsMMjEedsvvYmcMhEOdQwzKR5UD1Mm_sg',
	libraries: ['places'],
	version: '3'
}) (MapContainer))
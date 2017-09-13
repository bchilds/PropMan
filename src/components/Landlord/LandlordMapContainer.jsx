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
		this.onMarkerClicked = this.onMarkerClicked.bind(this)
	}

	onMarkerClicked(props, marker, e) {
		this.props.history.push(`/proprietor/properties/${props.property.property_id}`)
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
						return <Marker key={p.property_id} property={p} position={pos} onClick={this.onMarkerClicked}/>
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
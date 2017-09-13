import React from 'react'
import { GoogleApiWrapper } from 'google-maps-react';
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import SimpleMap from './LandlordMap.jsx'
import Marker from './LandlordMarker.js'
import { connect } from 'react-redux'

export class MapContainer extends React.Component {

	constructor(props){
		super(props)
		this.onMarkerDblClicked = this.onMarkerDblClicked.bind(this)
		this.state = {
			properties: props.properties
		}
	}

	onMarkerDblClicked(props, marker, e) {
		this.props.history.push(`/proprietor/properties/${props.property.property_id}`)
	}

	render() {
		return (
			<div>
				<SimpleMap google={this.props.google} centerAroundCurrentLocation={true}>
					{this.state.properties.map(p => {
						let pos = {
							lat: p.lat,
							lng: p.lng
						}
						return <Marker key={p.property_id} property={p} position={pos} onDblclick={this.onMarkerDblClicked}/>
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
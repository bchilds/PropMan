import React from 'react'
import { GoogleApiWrapper } from 'google-maps-react';
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import SimpleMap from './LandlordMap.jsx'

export class MapContainer extends React.Component {

	constructor(props){
		super()
	}

	render() {
		return (
			<div>
				<SimpleMap google={this.props.google}
				/>
			</div>
		)
	}
  
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyBsMMjEedsvvYmcMhEOdQwzKR5UD1Mm_sg',
	libraries: ['places'],
	version: '3'
}) (MapContainer)
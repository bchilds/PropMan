import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

class SimpleMap extends React.Component {

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.google !== this.props.google) {
			this.loadMap()
		}
	}

	loadMap() {
		if(this.props && this.props.google) {
			const {google} = this.props
			const maps = google.maps

			const mapRef = this.refs.map
			const node = ReactDOM.findDOMNode(mapRef)
			let zoom = 14
			let lat = 30.2705365
			let long = -97.7362387
			const center = new maps.LatLng(lat, long)
			const mapConfig = Object.assign({}, {
				center: center,
				zoom: zoom
			})
			this.map = new maps.Map(node, {center: center, zoom: zoom})
			this.forceUpdate();
		}
	}

	render() {
		return (
			<div ref='map' style={{width: "70vw", height: "50vh"}} >
				Loading Map...
			</div>
		)
	}
}

export default SimpleMap
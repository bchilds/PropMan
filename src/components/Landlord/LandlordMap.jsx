import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

const camelize = function(str) {
  return str.split(' ').map(function(word){
    return word.charAt(0).toUpperCase() + word.slice(1)
  }).join('')
}

const evtNames = [
  'ready',
  'click',
  'dragend',
  'recenter',
  'bounds_changed',
  'center_changed',
  'dblclick',
  'dragstart',
  'heading_change',
  'idle',
  'maptypeid_changed',
  'mousemove',
  'mouseout',
  'mouseover',
  'projection_changed',
  'resize',
  'rightclick',
  'tilesloaded',
  'tilt_changed',
  'zoom_changed'
]

export class SimpleMap extends React.Component {

	constructor(props) {
		super(props)
		const {lat, lng} = this.props.initialCenter
		this.state = {
			currentLocation: {
				lat: lat,
				lng: lng,
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.google !== this.props.google) {
			this.loadMap()
		}
		if(prevState.currentLocation !== this.state.currentLocation) {
			this.recenterMap()
		}
	}

	recenterMap() {
		const map = this.map
		const cur = this.state.currentLocation

		const google = this.props.google
		const maps = google.maps

		if(map) {
			let center = new maps.LatLng(cur.lat, cur.lng)
			map.panTo(center)
		}
	}

	loadMap() {
		if(this.props && this.props.google) {
			const {google} = this.props
			const maps = google.maps

			const mapRef = this.refs.map
			const node = ReactDOM.findDOMNode(mapRef)

			let {initialCenter, zoom} = this.props
			const {lat, lng} = this.state.currentLocation

			const center = new maps.LatLng(lat, lng)
			const mapConfig = Object.assign({}, {
				center: center,
				zoom: zoom,
			})
			this.map = new maps.Map(node, mapConfig)

			evtNames.forEach(e => {
        this.map.addListener(e, this.handleEvent(e))
      });


      maps.event.trigger(this.map, 'ready')
      this.forceUpdate()
		}
	}

  handleEvent(evtName) {
  	let timeout;
  	const handlerName = `on${camelize(evtName)}`

  	return (e) => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null;
      }
      timeout = setTimeout(() => {
        if (this.props[handlerName]) {
          this.props[handlerName](this.props, this.map, e)
        }
      }, 0);
  	}
  }

	componentDidMount() {
		if(this.props.centerAroundCurrentLocation && navigator && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((pos) => {
				const coords = pos.coords
				this.setState({
					currentLocation: {
						lat: coords.latitude,
						lng: coords.longitude,
					}
				})
			})
		}
		this.loadMap()
	}

	renderChildren() {
		const {children} = this.props
		if(!children) return
		return React.Children.map(children, c => {
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation,
      })
    })
	}

	render() {
		return (
      <div className="LandlordMap" ref='map' style={{width: "90VW", height: "80VH"}} >
				Loading Map...
				{this.renderChildren()}
			</div>
		)
	}
}

SimpleMap.propTypes = {
	google: PropTypes.object,
	zoom: PropTypes.number,
	initialCenter: PropTypes.object,
	centerAroundCurrentLocation: PropTypes.bool,
	onMove: PropTypes.func,
}
evtNames.forEach(e => SimpleMap.propTypes[camelize(e)] = PropTypes.func)

SimpleMap.defaultProps = {
	zoom:15,
	initialCenter: {
		lat: 30.2700945,
		lng: -97.7410364
	},
	centerAroundCurrentLocation: false,
}

export default SimpleMap

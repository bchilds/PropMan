import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectedMedia, getMessages, getDocs } from '../../actions/tenantDashboardGetters';
import { getBroadcasts } from '../../actions/broadcastsGetter';


class TenantSideBar extends Component {

	componentDidMount() {
		// this.props.getBroadcasts(this.props.userId)
		// this.props.getDocs(this.props.userId)
	}

	renderBroadcasts() {
		let reversedBroadcasts = this.props.broadcasts.reverse()

		return reversedBroadcasts.map((bcast, i) => {
			return (
				<div id="truncate" key={i} onClick={() => this.props.selectedMedia(bcast.message_title, bcast.message_content)}> {bcast.message_title} </div>
			)
		})
	}

	renderDocs() {
		return this.props.docs && this.props.docs.map((doc, i) => {
			return (
				<div id="truncate" key={i} onClick={() => this.props.selectedMedia(doc)}> {doc} </div>
			)
		})
	}

	render() {
		return (
			<div id="tenantSidebar">
			  <h3 className="sidebarTitle">Broadcasts</h3>
	        {this.props.broadcasts ? this.renderBroadcasts(): 'No Broadcasts'}
				<h3 className="sidebarTitle">Documents</h3>
				 {this.props.docs ? this.renderDocs(): 'No docs'}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return{
		broadcasts: state.broadcasts,
		docs: state.docs && state.docs.tenantDocs,
		userId: state.user && state.user.user_id,
		propId: state.properties && state.properties.propId
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({selectedMedia, getBroadcasts, getDocs}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TenantSideBar);
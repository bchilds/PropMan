import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectedMedia, getMessages, getDocs } from '../../actions/tenantDashboardGetters';
import { getBroadcasts } from '../../actions/broadcastsGetter';
import Documents from '../Landlord/LandlordTenantDocuments.jsx'

class TenantSideBar extends Component {
	constructor(props) {
    super(props)
	}

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

	showDonut(props) {
		props.showDonut()
	}

	render() {
		return (
			<div id="tenantSidebar">
				<h3 className="sidebarTitle"><div onClick={this.showDonut.bind(this, this.props)}>Expenses</div></h3>
			  <h3 className="sidebarTitle">Broadcasts</h3>
	        {this.props.broadcasts ? this.renderBroadcasts(): 'No Broadcasts'}
				<Documents tenant_id={this.props.tenant_id} />
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

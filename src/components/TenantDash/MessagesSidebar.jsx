import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPropertyTenants } from '../../actions/getPropertyTenants';
import { setCurrentConvo } from '../../actions/sortMessages';
import { Accordion, Panel } from 'react-bootstrap'
import MessageSidebarLandlord from '../Landlord/MessageSidebarLandlord.jsx'


class MessagesSidebar extends Component {
	constructor() {
		super()

	}

	renderPropTenants() {
		return (
			<tbody>
			  {this.props.propertyTenants.map((t, i) => {
			  	return (<tr onClick={() => {this.props.setCurrentConvo(this.props.sortedMesgs[t.user_id], t.user_id)}}>
			  		<td>{i === 0 ? "Landlord: " + t.user_name: t.user_name}</td></tr>)
			  	}
				)}
			</tbody>
		)
	}

	render() {
		return (
			<div id="tenantSidebar">
			  <h3 className="sidebarTitle">Direct Messages</h3>
			    {this.props.isLandlord ? 
			      <MessageSidebarLandlord />
			    :
		        <table className="table table-hover">
		        	{this.renderPropTenants()}
		        </table>
	        }
			</div>
		)
	}
}

function mapStateToProps(state) {

	return{
		sortedMesgs: state.sortedMessages,
		landlordProperties: state.landlordProperties,
		messages: [],
		userId: state.user && state.user.user_id,
		isLandlord: state.user && state.user.is_landlord,
		contacts: state.tenantData,
		propId: state.tenantData && state.tenantData.property_id,
		propertyTenants: [state.tenantsLandlord].concat(state.otherTenants)

	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setCurrentConvo, getPropertyTenants}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesSidebar);


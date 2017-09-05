import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Accordion, Panel } from 'react-bootstrap'
import { setCurrentConvo } from '../../actions/sortMessages';


class MessagesSidebarLandlord extends Component {
	constructor() {
		super()

		this.tenantClicked = this.tenantClicked.bind(this)
	}

	tenantClicked(tenant) {
		console.log(tenant, this.props.sortedMesgs)
		this.props.setCurrentConvo(this.props.sortedMesgs[tenant.user_id], tenant.user_id, tenant.user_name)
	}

	renderPropTenants(propertyId) {
		return (
			<table className="table table-hover">
				<tbody>
		    {this.props.sortedTenByProp[propertyId] && this.props.sortedTenByProp[propertyId].map(t => {
		    	return (
	    			<tr onClick={() => {this.tenantClicked(t)}}>
				      <td>{t.user_name}</td>
	    			</tr>
		      )
		     })}	
		    </tbody>
	    </table>
		)
	}

	render() {
		return (
			<div id="tenantSidebar">
				<h3 className="sidebarTitle">Direct Messages</h3>
	      <Accordion>
				  {this.props.landlordProperties.map((v, i) => {
				  	return (
				  		<Panel header={v.property_name} eventKey={i}>
				  			{this.renderPropTenants(v.property_id)}
				  		</Panel>
			  		)
					})}
	      </Accordion>
			</div>
		)
	}
}

function mapStateToProps(state) {

	return{
		sortedMesgs: state.sortedMessages,
		landlordProperties: state.landlordProperties,
		userId: state.user && state.user.user_id,
		contacts: state.tenantData,
		propId: state.tenantData && state.tenantData.property_id,
		sortedTenByProp: state.sortedTenByProp

	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setCurrentConvo}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesSidebarLandlord);
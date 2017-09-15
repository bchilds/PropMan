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
		this.props.setCurrentConvo(this.props.sortedMesgs[tenant.user_id], tenant.user_id, tenant.user_name)
	}

	renderPropTenants(propertyId, i) {
		return (
			<div id={i} className="accordion-body collapse mobileFont">
	    {this.props.sortedTenByProp[propertyId] && this.props.sortedTenByProp[propertyId].map((t, i) => {
	    	return (
    			<div key={i} className="accordion-inner" onClick={() => {this.tenantClicked(t)}}>
			      <label className="addCursorPointer messageContacts">{t.user_name}</label>
    			</div>

	      )
	     })}	
	    </div>
		)
	}

	render() {
		return (
			<div id="tenantSidebar">
				<h3 className="sidebarTitle">Direct Messages</h3>
	      <div className="accordion" id="accordion2">
				  {this.props.landlordProperties.map((v, i) => {
				  	return (
				  		<div key={i} className="accordion-group">
				  		  <div className="accordion-heading">
				  		    <div className="accordion-toggle messageContacts" data-toggle="collapse" href={`#${i}`}>
				  		      {v.property_name} <i className="fa fa-caret-down fa-fw" aria-hidden="true"></i>
				  		    </div>
				  		  </div>
				  			  {this.renderPropTenants(v.property_id, i)}
				  		</div>
			  		)
					})}
	      </div>
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
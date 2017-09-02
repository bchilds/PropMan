import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Accordion, Panel } from 'react-bootstrap'


class MessagesSidebarLandlord extends Component {
	constructor() {
		super()

		this.tenantClicked = this.tenantClicked.bind(this)
	}

	tenantClicked(tenant) {
		console.log(tenant)
	}

	renderPropTenants() {
		return (
			<table className="table table-hover">
				<tbody>
		    {this.props.propertyTenants.map(t => {
		    	return (
	    			<tr onClick={() => {this.tenantClicked(t)}}>
				      <td>{t.name}</td>
	    			</tr>
		      )
		     })}	
		    </tbody>
	    </table>
		)
	}

	render() {
		return (
			<div className="paymentSetup">
	      <Accordion>
				  {this.props.landlordProperties.map((v, i) => {
				  	return (
				  		<Panel header={v.property_name} eventKey={i}>
				  			{this.renderPropTenants()}
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
		messages: [],
		userId: state.user && state.user.user_id,
		contacts: state.tenantData,
		propId: state.tenantData && state.tenantData.property_id,
		propertyTenants: [{name:'Shebaz', id: 4}, {name: 'Jordan', id: 3}, {name: 'Ben', id: 2}] //state.propertyTenants

	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({currentConvo}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesSidebarLandlord);
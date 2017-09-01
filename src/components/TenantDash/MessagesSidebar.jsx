import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPropertyTenants } from '../../actions/getPropertyTenants';
import { currentConvo } from '../../actions/sortMessages';


class MessagesSidebar extends Component {
	constructor() {
		super()

		this.state = {
			directMesgs: []
		}
	}

	componentDidMount() {
		// this.props.getPropertyTenants(this.props.propId)
	}

	renderPropTenants() {
		return (
			<tbody>
			  {this.props.propertyTenants.map(v => {
			  	return (<tr onClick={() => {this.props.currentConvo(this.props.sortedMesgs[v.id], v.id)}}><td>{v.name}</td></tr>)
				})}
			</tbody>
		)
	}

	render() {
		return (
			<div id="tenantSidebar">
			  <h3 className="sidebarTitle">Direct Messages</h3>
	        <table className="table table-hover">
	        	{this.renderPropTenants()}
	        </table>
			</div>
		)
	}
}

function mapStateToProps(state) {

	return{
		sortedMesgs: state.sortedMessages,
		messages: [],
		userId: state.user && state.user.user_id,
		contacts: state.tenantData,
		propId: state.tenantData && state.tenantData.property_id,
		propertyTenants: [{name:'Shebaz', id: 4}, {name: 'Jordan', id: 3}, {name: 'Ben', id: 2}] //state.propertyTenants

	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({currentConvo, getPropertyTenants}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesSidebar);


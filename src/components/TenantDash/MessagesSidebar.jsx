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

		this.state = {
			mobile: false
		}
	}

	componentDidMount() {
		var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    var mobile = false
    if (x < 481) {
    	mobile = true
    }
		this.setState({mobile: mobile})
	}

	renderPropTenants() {
		return (
			<div>
			  {this.props.propertyTenants && this.props.propertyTenants.map((t, i) => {
			  	return (<div key={i} onClick={() => {this.props.setCurrentConvo(this.props.sortedMesgs[t.user_id], t.user_id, t.user_name)}}>
			  		<label className="messageContacts">{i === 0 ? "Landlord: " + t.user_name: t.user_name}</label></div>)
			  	}
				)}
			</div>
		)
	}

	render() {
		return (
			this.state.mobile ?
			<div id="tenantSidebar">
				<div className="accordion" id="accordionEx" role="tablist" aria-multiselectable="true">
			    <div id="tenantSidebar" className="card col-xs-12">
		        <div className="card-header" role="tab" id="headingOne">
	            <a data-toggle="collapse" data-parent="#accordionEx" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                <h4 className="mb-0 mobileSidebarDash">
                  Direct Messages <i className="fa fa-caret-down fa-fw" aria-hidden="true"></i>
                </h4>
	            </a>
		        </div>

		        <div id="collapseOne" className="collapse" role="tabpanel" aria-labelledby="headingOne">
	            <div className="card-body">
	              {this.renderPropTenants()}
	            </div>
		        </div>
			    </div>
				</div>
			</div>
			:
				<div id="tenantSidebar">
				  <h3 className="sidebarTitle">Direct Messages</h3>
		        {this.renderPropTenants()}
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


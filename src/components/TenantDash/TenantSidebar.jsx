import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectedMedia, getMessages, getDocs, showDonut } from '../../actions/tenantDashboardGetters';
import { getBroadcasts } from '../../actions/broadcastsGetter';
import Documents from '../Landlord/LandlordTenantDocuments.jsx'

class TenantSideBar extends Component {
	constructor(props) {
    super(props)

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

	renderBroadcasts() {
		// console.log(this.props.broadcasts)
		let reversedBroadcasts = this.props.broadcasts.sort((a,b) => { 
			return b.message_id - a.message_id 
		})
		// console.log(reversedBroadcasts)
		return reversedBroadcasts.map((bcast, i) => {
			// console.log(bcast)
			return (
				<div id="truncate" key={i} onClick={() => this.props.selectedMedia(bcast.message_title, bcast.message_content)}> {bcast.message_title} </div>
			 )
		})
	}


	render() {
		return (
			this.state.mobile ? 
					<div className="accordion " id="accordionEx" role="tablist" aria-multiselectable="true">
				    <div className="card col-sm-12 col-xs-12">
	            <a data-toggle="collapse" data-parent="#accordionEx" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
	              <h4 className="mb-0 mobileSidebarDash" onClick={() => this.props.showDonut()}>
	                Expenses
	              </h4>
	            </a>
				    </div>
				    <div className="card col-sm-12 col-xs-12">
			        <div className="card-header" role="tab" id="headingOne">
		            <a data-toggle="collapse" data-parent="#accordionEx" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
	                <h4 className="mb-0 mobileSidebarDash">
	                  Broadcasts
	                </h4>
		            </a>
			        </div>

			        <div id="collapseOne" className="collapse" role="tabpanel" aria-labelledby="headingOne">
		            <div className="card-body">
		              {this.props.broadcasts ? this.renderBroadcasts(): 'No Broadcasts'}
		            </div>
			        </div>
				    </div>

				    <div className="card col-sm-12 col-xs-12">
			        <div className="card-header" role="tab" id="headingTwo">
		            <a className="collapsed" data-toggle="collapse" data-parent="#accordionEx" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
	                <h4 className="mb-0 mobileSidebarDash">
	                  Documents
	                </h4>
		            </a>
			        </div>

			        <div id="collapseTwo" className="collapse" role="tabpanel" aria-labelledby="headingTwo">
		            <div className="card-body">
		              <Documents tenant_id={this.props.tenant_id} />
		            </div>
			        </div>
				    </div>
					</div>
				:
					<div id="tenantSidebar">
						<div className="dashSidebar">
							<h3 className="sidebarTitle"><div onClick={() => this.props.showDonut()}>Expenses</div></h3>
						  <h3 className="sidebarTitle">Broadcasts</h3>
				        {this.props.broadcasts ? this.renderBroadcasts(): 'No Broadcasts'}
						</div>
						<div className="dashSidebar">
							<Documents tenant_id={this.props.tenant_id} />
						</div>
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
  return bindActionCreators({selectedMedia, getBroadcasts, getDocs, showDonut}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TenantSideBar);

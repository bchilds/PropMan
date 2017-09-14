import React from 'react'
import { connect } from 'react-redux'
import Documents from './LandlordTenantDocuments.jsx'
import defaultTenantPic from '../../images/user-silhouette.png'

function mapStateToProps(state, match) {
  const url = [...match.match.url.split('/')]
  const property_id = Number(url[3])
  const tenant_id = Number(url[4])
  return {
    // properties: state.landlordProperties,
    // tenants: state.landlordTenants,
    property_id,
    property: state.landlordProperties.filter(property => property.property_id === property_id)[0],
    tenant_id,
    tenant: state.landlordTenants.filter(tenant => tenant.tenant_id === tenant_id)[0]
  }
}

class Tenant extends React.Component {
  constructor(props) {
    super()
    // console.log('constructor props', props)
  }

  componentWillReceiveProps() {
  }

  render() {
    const property = this.props.property || {property_name: '', address: ''};
    const tenant = this.props.tenant || {tenant_email: '', rent:'', due_date: ''};

    return (
      <div>
        <h3 className="pageTitle">{tenant.tenant_email}</h3>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <img style={{height: '120px', width: '120px', float: 'right'}} src={defaultTenantPic} />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 propertyInfo">
            <p>Property: {property.property_name}</p>
            <p>Address: {property.address}</p>
            <p>Rent: {tenant.rent}</p>
            <p>Due: {tenant.due_date}</p>
          </div>
        </div>
        <div className="row">
          <hr />
          <Documents tenant_id={this.props.tenant_id} />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Tenant)

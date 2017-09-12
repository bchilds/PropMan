import React from 'react'
import { connect } from 'react-redux'
import Documents from './LandlordTenantDocuments.jsx'

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
    const property = this.props.property;
    const tenant = this.props.tenant;
    return (
      <div>
        <h3>{this.props.tenant.tenant_email}</h3>
        <p>Property: {this.props.property.property_name}</p>
        <p>Address: {this.props.property.address}</p>
        <p>Rent: {this.props.tenant.rent}</p>
        <p>Due: {this.props.tenant.due_date}</p>
        <Documents tenant_id={this.props.tenant_id} />
      </div>
    )
  }
}

export default connect(mapStateToProps)(Tenant)

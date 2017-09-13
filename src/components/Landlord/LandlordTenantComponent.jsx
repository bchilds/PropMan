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
    const property = this.props.property || {property_name: '', address: ''};
    const tenant = this.props.tenant || {tenant_email: '', rent:'', due_date: ''};

    return (
      <div>
        <h3>{tenant.tenant_email}</h3>
        <p>Property: {property.property_name}</p>
        <p>Address: {property.address}</p>
        <p>Rent: {tenant.rent}</p>
        <p>Due: {tenant.due_date}</p>
        <Documents tenant_id={this.props.tenant_id} />
      </div>
    )
  }
}

export default connect(mapStateToProps)(Tenant)

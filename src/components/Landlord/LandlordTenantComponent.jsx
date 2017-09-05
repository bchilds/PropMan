import React from 'react'
import { connect } from 'react-redux'

function mapStateToProps(state, match) {
  const url = [...match.match.url.split('/')]
  console.log(url)
  // const property_id = Number(match.match.params.id);
  console.log('match', match.match)
  return {
    property: state.landlordProperties.filter(property => property.property_id === Number(url[3]))[0],
    tenant: state.landlordTenants.filter(tenant => tenant.tenant_id === Number(url[4]))[0]
  }
}

class Tenant extends React.Component {
  constructor(props) {
    super()
  }

  render() {
    console.log('property', this.props.property)
    console.log('tenant', this.props.tenant)
    const property = this.props.property;
    const tenant = this.props.tenant;
    return (
      <div>
        <h3>{tenant.tenant_email}</h3>
        <p>Property: {property.property_name}</p>
        <p>Address: {property.address}</p>
        <p>Rent: {tenant.rent}</p>
        <p>Due: {tenant.due_date}</p>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Tenant)

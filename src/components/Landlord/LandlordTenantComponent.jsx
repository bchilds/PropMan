import React from 'react'
import { connect } from 'react-redux'

function mapStateToProps(state, match) {
  const url = [...match.match.url.split('/')]
  return {
    // properties: state.landlordProperties,
    // tenants: state.landlordTenants,
    property: state.landlordProperties.filter(property => property.property_id === Number(url[3]))[0],
    tenant: state.landlordTenants.filter(tenant => tenant.tenant_id === Number(url[4]))[0]
  }
}

class Tenant extends React.Component {
  constructor(props) {
    super()
    console.log('constructor props', props)
  }

  componentWillReceiveProps() {
  }

  render() {
    console.log('render props', this.props)
    const property = this.props.property;
    const tenant = this.props.tenant;
    return (
      <div>
        <h3>{this.props.tenant.tenant_email}</h3>
        <p>Property: {this.props.property.property_name}</p>
        <p>Address: {this.props.property.address}</p>
        <p>Rent: {this.props.tenant.rent}</p>
        <p>Due: {this.props.tenant.due_date}</p>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Tenant)

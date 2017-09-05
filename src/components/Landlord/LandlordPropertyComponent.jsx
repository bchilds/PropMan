import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { addPropertyTenant, getPropertyTenants2 } from '../../actions/propertyGetters.js'

function mapStateToProps(state, match) {
  const property_id = Number(match.match.params.id);
  return {
    property: state.landlordProperties.filter(property => property.property_id === property_id)[0],
    tenants: state.propertyTenants2
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addPropertyTenant, getPropertyTenants2}, dispatch)
}

class Property extends React.Component {
  constructor(props) {
    super()
    props.getPropertyTenants2(props.property.property_id)
  }

  addTenantButton(e) {
    e.preventDefault()
    // console.log(JSON.stringify(this.props.property.property_id))
    let res = this.props.addPropertyTenant({
      "property_id": this.props.property.property_id,
      "tenant_email": e.target.tenant_email.value,
      "rent": e.target.rent.value,
      "due_date": e.target.due_date.value
    }, (res, data) => {
      if (res) {
        console.log(res, data)
      } else {
        alert('failure to login upon signup')
      }
    })
    e.target.tenant_email.value = ''
    e.target.rent.value = ''
    e.target.due_date.value = ''
  }

  render() {
    const options = {
      onRowClick: (row, columnIndex, rowIndex) => {
        // console.log(`/proprietor/properties/${this.props.property.property_id}/${row.tenant_id}`)
        this.props.history.push(`/proprietor/properties/${this.props.property.property_id}/${row.tenant_id}`);
      }
    }
    const property = this.props.property;
    return (
      <div>
        <h2 className="pageTitle">{property.property_name}</h2>
        <p>Address: {property.address}</p>
        <p>City: {property.city}</p>
        <p>State: {property.state_abbrv}</p>
        <h3>Tenants</h3>
        <form className="addTenantForm" onSubmit={this.addTenantButton.bind(this)}>
          <input className="addTenantInput" name="tenant_email" placeholder="Tenant Email"></input>
          <input className="addTenantInput" name="rent" placeholder="Rent Amount"></input>
          <input className="addTenantInput" name="due_date" placeholder="Rent Due"></input>
          <button className="" type="submit">Add Tenant</button>
        </form>
        <BootstrapTable data={ this.props.tenants } options={ options } striped={ true } hover={ true } condensed={ true }>
          <TableHeaderColumn dataField='tenant_id' dataSort={ true } isKey={ true } hidden={ true }>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='tenant_email' dataSort={ true }>Email</TableHeaderColumn>
          <TableHeaderColumn dataField='rent' dataSort={ true }>Rent</TableHeaderColumn>
          <TableHeaderColumn dataField='due_date' dataSort={ true }>Due</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Property)

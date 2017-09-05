import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { addTenant, getTenants } from '../../actions/landlordGetters.js'

function mapStateToProps(state) {
  return {
    landlord: state.landlordData,
    property: state.landlordProperties,
    tenants: state.landlordTenants
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addTenant, getTenants}, dispatch)
}

class Tenants extends React.Component {
  constructor(props) {
    super()
    props.getTenants(props.landlord.landlord_id)
  }

  addTenantButton(e) {
    e.preventDefault()
    // console.log(JSON.stringify(this.props.property.property_id))
    let res = this.props.addTenant({
      "tenant_email": e.target.tenant_email.value,
      "property_id": e.target.property_id.value,
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
    e.target.property_id.value = ''
    e.target.rent.value = ''
    e.target.due_date.value = ''
  }

  render() {
    const options = {
      onRowClick: (row, columnIndex, rowIndex) => {
        console.log(`/proprietor/properties/${row.property_id}/${row.tenant_id}`)
        this.props.history.push(`/proprietor/properties/${row.property_id}/${row.tenant_id}`);
      }
    }

    return (
      <div>
      <h2>Tenants</h2>
      <form className="addTenantForm" onSubmit={this.addTenantButton.bind(this)}>
        <input className="addTenantInput" name="tenant_email" placeholder="Tenant Email"></input>
        <input className="addTenantInput" name="property_id" placeholder="Property ID"></input>
        <input className="addTenantInput" name="rent" placeholder="Rent Amount"></input>
        <input className="addTenantInput" name="due_date" placeholder="Rent Due"></input>
        <button className="" type="submit">Add Tenant</button>
      </form>
      <BootstrapTable data={ this.props.tenants } options={ options } striped={ true } hover={ true } condensed={ true }>
        <TableHeaderColumn dataField='tenant_email' dataSort={ true } isKey={ true }>Email</TableHeaderColumn>
        <TableHeaderColumn dataField='property_id' dataSort={ true }>Property</TableHeaderColumn>
        <TableHeaderColumn dataField='rent' dataSort={ true }>Rent</TableHeaderColumn>
        <TableHeaderColumn dataField='due_date' dataSort={ true }>Due</TableHeaderColumn>
        <TableHeaderColumn dataField='message' dataSort={ true }>Message</TableHeaderColumn>
      </BootstrapTable>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tenants)

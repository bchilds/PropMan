
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { addProperty } from '../../actions/landlordGetters'

function mapStateToProps(state) {
  return {
    properties: state.landlordProperties,
    landlordData: state.landlordData
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addProperty}, dispatch)
}

class Properties extends React.Component {
  addPropertyButton(e) {
    e.preventDefault()
    let res = this.props.addProperty({
      "landlord_id": this.props.landlordData.landlord_id,
      "property_name": e.target.property_name.value,
      "address": e.target.address.value,
      "city": e.target.city.value,
      "state_abbrv": e.target.state_abbr.value
    }, (res, data) => {
      if (res) {
        console.log(res, data)
      } else {
        alert('failure to login upon signup')
      }
    })
    e.target.property_name.value = '',
    e.target.address.value = '',
    e.target.city.value = '',
    e.target.state_abbr.value = ''
  }

  render() {
    const options = {
      onRowClick: (row, columnIndex, rowIndex) => {
        this.props.history.push(`/proprietor/properties/${row.property_id}`);
      }
    }

    return (
      <div>
      <h2>Properties</h2>
      <form className="addPropertyForm" onSubmit={this.addPropertyButton.bind(this)}>
        <input className="addPropertyInput" name="property_name" placeholder="Property Name"></input>
        <input className="addPropertyInput" name="address" placeholder="Address"></input>
        <input className="addPropertyInput" name="city" placeholder="City"></input>
        <input className="addPropertyInput" name="state_abbr" placeholder="State Abbreviation"></input>
        <button className="" type="submit">Add Property</button>
      </form>
      <BootstrapTable data={ this.props.properties } options={ options } striped={ true } hover={ true } condensed={ true }>
        <TableHeaderColumn dataField='property_id' isKey={ true }  dataSort={ true } hidden={ true }>ID</TableHeaderColumn>
        <TableHeaderColumn dataField='property_name' dataSort={ true }>Name</TableHeaderColumn>
        <TableHeaderColumn dataField='address' dataSort={ true }>Address</TableHeaderColumn>
        <TableHeaderColumn dataField='city' dataSort={ true }>City</TableHeaderColumn>
        <TableHeaderColumn dataField='state_abbrv' dataSort={ true }>State</TableHeaderColumn>
      </BootstrapTable>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Properties)

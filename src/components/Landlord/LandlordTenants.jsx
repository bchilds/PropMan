import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Accordion, Panel } from 'react-bootstrap'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { months, days, years } from '../Payment/formHelperData'
import { addTenant, getTenants } from '../../actions/landlordGetters.js'

function mapStateToProps(state) {
  return {
    landlord: state.landlordData,
    properties: state.landlordProperties,
    tenants: state.landlordTenants
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addTenant, getTenants}, dispatch)
}

class Tenants extends React.Component {
  constructor(props) {
    super()
    // props.getTenants(props.landlord.landlord_id)
  }

  componentDidUpdate() {
    var property_id_name = {}
    this.props.properties.map(property => {
        property_id_name[property.property_id] = property.property_name
    })
    this.props.tenants.map(tenant => {
      tenant['property_name'] = property_id_name[tenant.property_id]
    })
  }

  addTenantButton(e) {
    e.preventDefault()
    const property = this.props.properties.filter((property) => {
      return property.property_name === e.target.property_id.value
    })[0]
    let monthNum = months.indexOf(e.target.month.value) + 1
    let res = this.props.addTenant({
      "tenant_email": e.target.tenant_email.value,
      "property_id": property.property_id,
      "rent": e.target.rent.value,
      "due_date": `${monthNum}/${e.target.day.value}/${e.target.year.value}`
    }, (res, data) => {
      if (res) {
        console.log(res, data)
      } else {
        alert('failure to login upon signup')
      }
    })
    e.target.tenant_email.value = ''
    e.target.rent.value = ''
  }

  renderProperties() {
    return this.props.properties.map((property) => {
      return (
        <option key={property.property_id}> {property.property_name} </option>
      )
    })
  }

  renderMonths() {
    return months.map((month, i) => {
      return (
        <option key={i}> {month} </option>
      )
    })
  }

  renderDays() {
    return days.map((day, i) => {
      return (
        <option key={i}> {day} </option>
      )
    })
  }

  renderYears() {
    return years.map((year, i) => {
      return (
        <option key={i}> {year} </option>
      )
    })
  }

  render() {
    const options = {
      onRowClick: (row, columnIndex, rowIndex) => {
        this.props.history.push(`/proprietor/properties/${row.property_id}/${row.tenant_id}`);
      }
    }

    return (
      <div>
      <h2 className="pageTitle">Tenants</h2>
      <form className="addTenantForm" onSubmit={this.addTenantButton.bind(this)}>
        <Accordion>
          <Panel header="Add a Tenant" eventKey="1">
            <label>Email</label>
            <br />
            <input className="addTenantInput" name="tenant_email" placeholder="john.doe@gmail.com"></input>
            <br /><br />
            <label>Property</label>
            <br />
            <select name="property_id">
              {this.renderProperties()}
            </select>
            <br /><br />
            <label>Rent</label>
            <br />
            <input className="addTenantInput" name="rent" placeholder="1200"></input>
            <br /><br />
            <label>Rent Due Date</label>
            <br />
            <select name="month">
              {this.renderMonths()}
            </select>
            <select name="day">
              {this.renderDays()}
            </select>
            <select name="year">
                {this.renderYears()}
              </select>
            <br /><br />
            <button className="" type="submit">Add</button>
          </Panel>
        </Accordion>
      </form>
      <BootstrapTable className="BootstrapTableFull" data={ this.props.tenants } options={ options } striped={ true } hover={ true } condensed={ true }>
        <TableHeaderColumn dataField='tenant_email' dataSort={ true } isKey={ true }>Email</TableHeaderColumn>
        <TableHeaderColumn dataField='property_name' dataSort={ true }>Property</TableHeaderColumn>
        <TableHeaderColumn dataField='rent' dataSort={ true }>Rent</TableHeaderColumn>
        <TableHeaderColumn dataField='due_date' dataSort={ true }>Due</TableHeaderColumn>
        <TableHeaderColumn dataField='message' dataSort={ true }>Message</TableHeaderColumn>
      </BootstrapTable>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tenants)

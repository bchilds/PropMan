import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Accordion, Panel } from 'react-bootstrap'

import { months, days, years } from '../Payment/formHelperData'
import Modal from 'react-modal';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import BroadcastModal from './BroadcastMessageModal.jsx';
import { addPropertyTenant, getPropertyTenants2 } from '../../actions/propertyGetters.js'
import { Documents } from './LandlordPropertyDocuments.jsx'

const customStyles = {
  content : {
    top             : '50%',
    left            : '50%',
    right           : '70%',
    bottom          : 'auto',
    marginRight     : '-50%',
    transform       : 'translate(-50%, -50%)',
    maxHeight       : '600px',
    minHeight       : '400px', // This sets the max height
    width           : '600px',
    overflow        : 'scroll', // This tells the modal to scroll
    border          : '1px solid black',
    //borderBottom          : '1px solid black', // for some reason the bottom border was being cut off, so made it a little thicker
    borderRadius    : '0px'
  }
};

function mapStateToProps(state, match) {
  const property_id = Number(match.match.params.id);
  return {
    property_id: property_id,
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

    this.state = {
      modalIsOpen: false,
      sendTo: -1
    }
    this.openModal = this.openModal.bind(this)
  }


  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentWillMount() {
    this.props.getPropertyTenants2(this.props.property_id)
  }

  componentWillReceiveProps() {
    this.props.getPropertyTenants2(this.props.property_id)
  }

  addTenantButton(e) {
    e.preventDefault()
    let monthNum = months.indexOf(e.target.month.value) + 1
    let res = this.props.addPropertyTenant({
      "property_id": this.props.property.property_id,
      "tenant_email": e.target.tenant_email.value,
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
        // console.log(`/proprietor/properties/${this.props.property.property_id}/${row.tenant_id}`)
        this.props.history.push(`/proprietor/properties/${this.props.property.property_id}/${row.tenant_id}`);
      }
    }
    const property = this.props.property;
    return (
      <div>
        <h2 className="pageTitle">{property && property.property_name}</h2>
        <p>Address: {property && property.address}</p>
        <p>City: {property && property.city}</p>
        <p>State: {property && property.state_abbrv}</p>
        <button onClick={this.openModal}> Create Broadcast </button>
        {this.state.modalIsOpen &&
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal.bind(this)}
            style={customStyles}
            contentLabel="Payment Modal"
          > 
            <BroadcastModal 
              onRequestClose={this.closeModal.bind(this)}
              propertyId={this.props.property.property_id}
              tenants={this.props.tenants} />
          </Modal>  
        }
        <h3>Tenants</h3>
        <form className="addTenantForm" onSubmit={this.addTenantButton.bind(this)}>
          <Accordion>
            <Panel header="Add a Tenant" eventKey="1">
              <label>Email</label>
              <br />
              <input className="addTenantInput" name="tenant_email" placeholder="john.doe@gmail.com"></input>
              <br /><br />
              <label>Rent Amount</label>
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
              <button className="" type="submit">Add Tenant</button>
            </Panel>
          </Accordion>
        </form>
        <BootstrapTable className="BootstrapTableFull" data={ this.props.tenants } options={ options } striped={ true } hover={ true } condensed={ true }>
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

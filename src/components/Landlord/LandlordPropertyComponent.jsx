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
import Documents from './LandlordPropertyDocuments.jsx'
import defaultPropertyPic from '../../images/home.png'
import { getBroadcasts } from '../../actions/broadcastsGetter.js'

const customStyles = {
  content : {
    top             : '50%',
    left            : '50%',
    right           : '70%',
    bottom          : 'auto',
    marginRight     : '-50%',
    transform       : 'translate(-50%, -50%)',
    maxHeight       : '600px',
    minHeight       : '400px',
    width           : '600px',
    overflow        : 'scroll',
    border          : '1px solid black',
    borderRadius    : '0px'
  }
};

function mapStateToProps(state, match) {
  const property_id = Number(match.match.params.id);
  return {
    user: state.user,
    landlord: state.landlordData,
    property_id: property_id,
    property: state.landlordProperties.filter(property => property.property_id === property_id)[0],
    tenants: state.propertyTenants2,
    broadcasts: state.broadcasts
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addPropertyTenant, getPropertyTenants2, getBroadcasts}, dispatch)
}

class Property extends React.Component {
  constructor(props) {
    super()
    this.state = {
      modalIsOpen: false,
      sendTo: -1,
      broadcastModal: false
    }
    this.openModal = this.openModal.bind(this)
  }

  componentWillMount() {
    this.props.getPropertyTenants2(this.props.property_id)
    this.props.getBroadcasts(this.props.property_id)
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  addTenantButton(e) {
    e.preventDefault()
    let monthNum = months.indexOf(e.target.month.value) + 1
    let res = this.props.addPropertyTenant({
      "property_id": this.props.property.property_id,
      "tenant_email": e.target.tenant_email.value,
      "rent": e.target.rent.value,
      "due_date": `${e.target.day.value}/${monthNum}/${e.target.year.value}`
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
        this.props.history.push(`/proprietor/properties/${this.props.property.property_id}/${row.tenant_id}`);
      }
    }
    const property = this.props.property;
    return (
      <div>
        <h2 className="pageTitle">{property && property.property_name}</h2>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <img style={{height: '120px', width: '120px', float: 'right'}} src={defaultPropertyPic} />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 propertyInfo">
            <p>Address: {property && property.address}</p>
            <p>City: {property && property.city}</p>
            <p>State: {property && property.state_abbrv}</p>
            <button onClick={this.openModal}> Create Broadcast </button>
          </div>
        </div>
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
        <div>
          <hr />
          <h3>Broadcasts</h3>
          {this.props.broadcasts.length===0 ? <p>Currently there are no broadcasts for this property</p> :
            this.props.broadcasts.map(broadcast => 
              <div key={broadcast.message_id}>
                <h5>{broadcast.message_title}</h5>
                <p>{broadcast.message_content}</p>
              </div>
            )
          }
        </div>
        <div>
          <hr />
          <h3>Tenants</h3>
          <form className="addTenantForm" onSubmit={this.addTenantButton.bind(this)}>
           <div className="accordion-group">
             <div className="accordion-heading">
               <div className="accordion-toggle" data-toggle="collapse" href="#1">
                 Add a Tenant
               </div>
               <div id="1" className="accordion-body collapse">
                 <div className="accordion-inner" id="addTenantsPanel">
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
                   <button className="btn btn-secondary" type="submit">Add</button>
                 </div>
               </div>
              </div>
            </div>
          </form>
        </div>
        <BootstrapTable className="BootstrapTableFull" data={ this.props.tenants } options={ options } striped={ true } hover={ true } condensed={ true }>
          <TableHeaderColumn dataField='tenant_id' dataSort={ true } isKey={ true } hidden={ true }>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='tenant_email' dataSort={ true }>Email</TableHeaderColumn>
          <TableHeaderColumn dataField='rent' dataSort={ true }>Rent</TableHeaderColumn>
          <TableHeaderColumn dataField='due_date' dataSort={ true }>Due</TableHeaderColumn>
        </BootstrapTable>
        <div>
          <hr />
          <Documents landlord_id={this.props.landlord.landlord_id} property_id={this.props.property_id} tenants={this.props.tenants} />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Property)

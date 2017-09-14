import React from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { connect } from 'react-redux'
import { Accordion, Panel, FormGroup, Checkbox } from 'react-bootstrap'
import { bindActionCreators } from 'redux'
import { addBill } from '../../actions/paymentGetters'
import PaymentForm from '../Payment/PaymentForm.jsx'
import PaymentSetup from '../Payment/PaymentForm.jsx'
import Modal from 'react-modal';
import { Link } from 'react-router-dom'

const customStyles = {
  content : {
    top             : '50%',
    left            : '50%',
    right           : '70%',
    bottom          : 'auto',
    marginRight     : '-50%',
    transform       : 'translate(-50%, -50%)',
    maxHeight       : '500px', // This sets the max height
    maxWidth        : '700px',
    overflow        : 'scroll', // This tells the modal to scroll
    border          : '1px solid black',
    //borderBottom          : '1px solid black', // for some reason the bottom border was being cut off, so made it a little thicker
    borderRadius    : '0px'
  }
};

class Transactions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      completedTransactions: [],
      incompleteTransactions: [],
      modalIsOpen: false,
      selectedIncompleteTransactionId: null
    }
  }

  componentDidMount() {
    this.setState({
      modalIsOpen: false
    })
  }

  openModal(transaction_id) {
    this.setState({
      modalIsOpen: true,
      selectedIncompleteTransactionId: transaction_id
    });
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  alterTransactions(transactions, otherTenants) {
    let roommateObj = otherTenants.reduce((obj, roommate) => {
      obj[roommate.user_id] = roommate
      return obj
    }, {})

    let alteredTransactions = transactions.map((transaction) => {
      let newObj = Object.assign({}, transaction)
      // date string manipulation to get only date
      newObj.created_date = newObj.created_date.split('T')[0]
      newObj.transaction_amount = `$${newObj.transaction_amount}`
      if (transaction.recipient_id === this.props.user.user_id) {
        newObj.payment_type = `${newObj.payment_type} (reimbursement from ${roommateObj[transaction.sender_id].user_name})`
      }
      return newObj
    })
    let completedTransactions = [...alteredTransactions].filter((transaction) => {
      return transaction.is_completed
    })

    let incompleteTransactions = [...alteredTransactions].filter((transaction) => {
      return !transaction.is_completed && (transaction.recipient_id !== this.props.user.user_id)
    })

    this.setState({
      completedTransactions: completedTransactions,
      incompleteTransactions: incompleteTransactions
    })
  }

  componentWillMount() {
    this.alterTransactions(this.props.transactions, this.props.otherTenants)
  }

  componentWillReceiveProps(nextProps) {
    this.alterTransactions(nextProps.transactions, nextProps.otherTenants)
  }

  renderRoommates() {
    return this.props.otherTenants.map((tenant, i) =>{
      if (tenant.user_id) {
        return (
          <div key={i}>
            <input type="checkbox" name="tenants" value={tenant.user_id}></input>
            <label> {tenant.user_name}</label>
          </div>
        )
      }
    })
  }

  handleBillAdd(e) {
    e.preventDefault()
    let selectedTenants = []
    if (!e.target.tenants.length) {
      selectedTenants.push(e.target.tenants.value)
    } else {    
      for (let i = 0; i < e.target.tenants.length; i++) {
        if (e.target.tenants[i].checked) {
          selectedTenants.push(e.target.tenants[i].value)
        }
      }
    }
    //selectedTenants is an array of selected users' ids
    this.props.addBill({
      billName: e.target.name.value,
      billAmount: e.target.amount.value,
      requesterUserId: this.props.user.user_id,
      sharers: selectedTenants
    })
  }

  renderIncompleteTransactions() {
    const incompleteOptions = {
      sortName: 'transaction_id',
      sortOrder: 'asc',
      // onRowClick: this.openModal.bind(this)
      onRowClick: (row, columnIndex, rowIndex) => {
        this.openModal.call(this, row.transaction_id)
      }
    }

    if (this.state.incompleteTransactions.length) {    
      return (
        <div>
          <div className="accordion-group incompleteTransactions">
            <div className="accordion-heading">
              <div className="accordion-toggle" data-toggle="collapse" href="#2">
                <h4>Incomplete Transactions</h4>
              </div>
              <div id="2" className="accordion-body collapse">
                <div>
                  <BootstrapTable options={incompleteOptions} data={ this.state.incompleteTransactions } striped={ true } hover={ true } condensed={ true }>
                    <TableHeaderColumn dataField='transaction_id' dataSort={ true } isKey={ true }>Transaction ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='created_date' dataSort={ true }>Date</TableHeaderColumn>
                    <TableHeaderColumn dataField='payment_type' dataSort={ true }>Description</TableHeaderColumn>
                    <TableHeaderColumn dataField='transaction_amount' dataSort={ true }>Amount</TableHeaderColumn>
                  </BootstrapTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div></div>
    )
  }

  renderBillShareContent() {
    if (this.props.user.merchant_id) {
      return (
        <div>
          <label>Bill Name</label><br/><input name="name" className="paymentInput"></input><br/>
          <label>Amount</label><br/><input name="amount" className="paymentInput"></input><br/>
          <label>Split (optional)</label>
          <fieldset>
            {this.renderRoommates()}
          </fieldset>
          <button type="submit">Submit</button>
        </div>
      )
    } else {
      return (
        <div>
          <p>
            It looks like you haven't set up your payment information yet. 
            <br/>
            To use bill share, please follow
            the link to set it up.
          </p>
          <button><Link to='/tenant/paymentsetup'>Set up payment</Link></button>
        </div>
      )
    }
  }

  render() {
    const completedOptions = {
      sortName: 'transaction_id',
      sortOrder: 'desc'
    }
    return (
      <div className="transactionsTable">
        <div className="accordion-group addBillAccordion">
          <div className="accordion-heading">
            <div className="accordion-toggle" data-toggle="collapse" href="#1">
              <div className="addBillHeader">
                Add a Bill  
              </div>
            </div>
            <div id="1" className="accordion-body collapse">
              <div className="accordion-inner" id="addPropertiesPanel">
                {this.renderBillShareContent()}
              </div>
            </div>
          </div>
        </div>
        <br/>
        {this.renderIncompleteTransactions()}
        <br/>
        <h4>Completed Transactions</h4>
        <BootstrapTable options={completedOptions} data={ this.state.completedTransactions } striped={ true } hover={ true } condensed={ true } pagination>
          <TableHeaderColumn dataField='transaction_id' dataSort={ true } isKey={ true }>Transaction ID</TableHeaderColumn>
          <TableHeaderColumn dataField='created_date' dataSort={ true }>Date</TableHeaderColumn>
          <TableHeaderColumn dataField='payment_type' dataSort={ true }>Description</TableHeaderColumn>
          <TableHeaderColumn dataField='transaction_amount' dataSort={ true }>Amount</TableHeaderColumn>
        </BootstrapTable>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          style={customStyles}
          contentLabel="Payment Modal"
        > 
          <PaymentForm paymentParams=
          {
            {
              transaction_id: this.state.selectedIncompleteTransactionId,
              httpMethod: 'put'
            }
          }
          />
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    transactions: state.sentTransactions.concat(state.receivedTransactions),
    otherTenants: state.otherTenants,
    tenantData: state.tenantData
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addBill}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions)

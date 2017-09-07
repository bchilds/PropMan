import React from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { connect } from 'react-redux'
import { Accordion, Panel, FormGroup, Checkbox } from 'react-bootstrap'
import { bindActionCreators } from 'redux'
import { addBill } from '../../actions/paymentGetters'

class Transactions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: this.props.transactions
    }
  }

  alterTransactions(transactions) {
    let alteredTransactions = transactions.map((transaction) => {
      let newObj = Object.assign({}, transaction)
      // date string manipulation to get only date
      newObj.created_date = newObj.created_date.split('T')[0]
      newObj.transaction_amount = `$${newObj.transaction_amount}`
      return newObj
    })
    alteredTransactions = alteredTransactions.filter((transaction) => {
      return transaction.is_completed
    })

    this.setState({
      transactions: alteredTransactions
    })
  }

  componentWillMount() {
    this.alterTransactions(this.props.transactions)
  }

  componentWillReceiveProps() {
    this.alterTransactions(this.props.transactions)
  }

  renderRoommates() {
    return this.props.otherTenants.map((tenant) =>{
      return (
        <div>
          <input type="checkbox" name="tenants" value={tenant.user_id}></input>
          <label> {tenant.user_name}</label>
        </div>
      )
    })
  }

  handleBillAdd(e) {
    e.preventDefault()
    let selectedTenants = []
    for (let i = 0; i < e.target.tenants.length; i++) {
      if (e.target.tenants[i].checked) {
        selectedTenants.push(e.target.tenants[i].value)
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

  render() {
    return (
      <div className="transactionsTable">
        <h2>Transactions</h2>
        <form onSubmit={this.handleBillAdd.bind(this)}>
          <Accordion className="addBillAccordion">
            <Panel header="Add bill" eventKey="1">
              <label>Bill Name</label><br/><input name="name" className="paymentInput"></input><br/>
              <label>Amount</label><br/><input name="amount" className="paymentInput"></input><br/>
              <label>Split (optional)</label>
              <fieldset>
                {this.renderRoommates()}
              </fieldset>
              <button type="submit">Submit</button>
            </Panel>
          </Accordion>
        </form>
        <BootstrapTable data={ this.state.transactions } striped={ true } hover={ true } condensed={ true }>
          <TableHeaderColumn dataField='transaction_id' dataSort={ true } isKey={ true }>Transaction ID</TableHeaderColumn>
          <TableHeaderColumn dataField='created_date' dataSort={ true }>Date</TableHeaderColumn>
          <TableHeaderColumn dataField='payment_type' dataSort={ true }>Description</TableHeaderColumn>
          <TableHeaderColumn dataField='transaction_amount' dataSort={ true }>Amount</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    transactions: state.sentTransactions,
    otherTenants: state.otherTenants
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addBill}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions)

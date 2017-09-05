import React from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

// const transactions = [
//     {id: 1, date: "08/01/2017", tenant: 'A', type: "Rent", amt: "$600"},
//     {id: 2, date: "08/01/2017", tenant: 'B', type: "Rent", amt: "$700"},
//     {id: 3, date: "08/01/2017", tenant: 'C', type: "Rent", amt: "$600"},
//     {id: 4, date: "08/01/2017", tenant: 'D', type: "Rent", amt: "$800"},
//     {id: 5, date: "08/01/2017", tenant: 'E', type: "Rent", amt: "$900"},
//     {id: 6, date: "09/01/2017", tenant: 'A', type: "Rent", amt: "$600"},
//     {id: 7, date: "09/01/2017", tenant: 'B', type: "Rent", amt: "$7000"},
//     {id: 8, date: "09/01/2017", tenant: 'C', type: "Rent", amt: "$600"},
//     {id: 9, date: "09/01/2017", tenant: 'D', type: "Rent", amt: "$800"},
//     {id: 10, date: "9/02/2017", tenant: 'E', type: "Rent (plus late fee)", amt: "$930"}
// ];

class LandlordTransactions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: this.props.transactions
    }
  }

  componentWillReceiveProps() {
    // created object where key is user id and value is user name
    let userNames = this.props.landlordTenants.reduce((obj, item) => {
      obj[item.user_id] = item.user_name
      return obj
    }, {})

    // add user name to each transaction
    let convertedTransactions = this.props.transactions.map((transaction) => {
      let cTransaction = Object.assign({}, transaction)
      cTransaction.sender_name = userNames[transaction.sender_id]
      return cTransaction
    })

    this.setState({
      transactions: convertedTransactions
    })
  }

  render() {
    if (this.props.landlordData.payment_set_up) {
      return (
        <div className="transactionsTable">
          <h2>Past Payments</h2>
          <BootstrapTable data={ this.state.transactions } striped={ true } hover={ true } condensed={ true }>
            <TableHeaderColumn dataField='transaction_id' dataSort={ true } isKey={ true }>Transaction ID</TableHeaderColumn>
            <TableHeaderColumn dataField='created_date' dataSort={ true }>Transaction Date</TableHeaderColumn>
            <TableHeaderColumn dataField='sender_name' dataSort={ true }>Tenant</TableHeaderColumn>
            <TableHeaderColumn dataField='transaction_amount' dataSort={ true }>Amount</TableHeaderColumn>
          </BootstrapTable>
        </div>
      )
    }
    return (
      <div className="paymentSetupWarning">
        <h4>Sorry! It looks like you haven't set up your payment information yet.</h4>
        <button><Link to='/proprietor/paymentsetup'>Set up payment</Link></button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    landlordData: state.landlordData,
    transactions: state.receivedTransactions,
    landlordTenants: state.landlordTenants
  }

}


export default connect(mapStateToProps, null)(LandlordTransactions)


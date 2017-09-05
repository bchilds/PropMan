import React from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { connect } from 'react-redux'

// const transactions = [
//     {id: 1, date: "01/01/2017", type: "Rent", amt: "$800"},
//     {id: 2, date: "02/01/2017", type: "Rent", amt: "$800"},
//     {id: 3, date: "03/01/2017", type: "Rent", amt: "$800"},
//     {id: 4, date: "04/01/2017", type: "Rent", amt: "$800"},
//     {id: 5, date: "05/01/2017", type: "Rent", amt: "$800"},
//     {id: 6, date: "06/01/2017", type: "Rent", amt: "$800"},
//     {id: 7, date: "07/01/2017", type: "Rent", amt: "$900"},
//     {id: 8, date: "08/01/2017", type: "Rent", amt: "$900"},
//     {id: 9, date: "09/01/2017", type: "Rent", amt: "$900"},
//     {id: 10, date: "10/01/2017", type: "Rent", amt: "$900"}
// ];


class Transactions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: this.props.transactions
    }
  }

  componentWillReceiveProps() {
    console.log(this.state.transactions)
    this.setState({
      transactions: this.props.transactions
    })
  }

  render() {
    return (
      <div className="transactionsTable">
        <h2>Past Payments</h2>
        <BootstrapTable data={ this.state.transactions } striped={ true } hover={ true } condensed={ true }>
          <TableHeaderColumn dataField='transaction_id' dataSort={ true } isKey={ true }>Transaction ID</TableHeaderColumn>
          <TableHeaderColumn dataField='created_date' dataSort={ true }>Date</TableHeaderColumn>
          <TableHeaderColumn dataField='transaction_amount' dataSort={ true }>Amount</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    transactions: state.sentTransactions
  }
}

export default connect(mapStateToProps, null)(Transactions)

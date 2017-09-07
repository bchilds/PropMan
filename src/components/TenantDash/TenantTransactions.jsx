import React from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { connect } from 'react-redux'

class Transactions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: this.props.transactions
    }
  }

  componentWillReceiveProps() {
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
          <TableHeaderColumn dataField='payment_type' dataSort={ true }>Description</TableHeaderColumn>
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

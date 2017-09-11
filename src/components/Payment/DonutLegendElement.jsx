import React from 'react'
import * as d3 from 'd3'

class DonutLegendElement extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span>
        <div className="fillColorBox" style={{backgroundColor: `${this.props.colorFill}` }}></div>
        <span>{this.props.item.payment_type}</span>
      </span>
    )
  }
}

export default DonutLegendElement
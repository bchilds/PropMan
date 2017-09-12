import React from 'react'
import * as d3 from 'd3'

class DonutLegendElement extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <span className="fillColorBox" style={{backgroundColor: `${this.props.colorFill}` }}></span>
        <span>{this.props.item.payment_type}</span>
      </div>
    )
  }
}

export default DonutLegendElement
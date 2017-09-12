import React from 'react'
import * as d3 from 'd3'
import DonutLegendElement from './DonutLegendElement.jsx'

class DonutLegend extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="donutLegend">
        {
          this.props.data.map((item, index) => {
            return <DonutLegendElement item={item} key={index} colorFill={this.props.colorScale[index]} />
          })
        }
      </div>
    )
  }
}

export default DonutLegend
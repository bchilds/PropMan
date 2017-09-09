import React from 'react'
import * as d3 from 'd3'
import Donut from './Donut.jsx'

class DonutWindow extends React.Component {

  render() {
    let width = 500
    let height = 500
    let minViewportSize = Math.min(width, height);
    // This sets the radius of the pie chart to fit within
    // the current window size, with some additional padding
    let radius = (minViewportSize * .9) / 2;
    // Centers the pie chart
    let x = width / 2;
    let y = height / 2;

    return (
      <div className="donutContainer">
        <svg className="donut" width={width} height={height}>
          <Donut x={x} y={y} radius={radius} data={this.props.data} />
        </svg>
      </div>
    );
  }
}

export default DonutWindow
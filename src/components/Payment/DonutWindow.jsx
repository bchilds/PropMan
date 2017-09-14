import React from 'react'
import * as d3 from 'd3'
import Donut from './Donut.jsx'
import DonutLegend from './DonutLegend.jsx'

class DonutWindow extends React.Component {
    constructor(props) {
      super()

      this.state = {
        height: 0,
        width: 0
      }
    }

  componentWillMount() {
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    this.setState({height: y, width: x})
  }

  render() {

    let width = 425
    let height = 425

    if (this.state.width < 400 && this.state.width > 350) {
      width = 350
      height = 350
    } else if (this.state.width <= 350) {
      width = 300
      height = 300
    }

    let minViewportSize = Math.min(width, height);
    // This sets the radius of the pie chart to fit within
    // the current window size, with some additional padding
    let radius = (minViewportSize * .9) / 2;
    // Centers the pie chart
    let x = width / 2;
    let y = height / 2;
    let colorScale =  ["rgba(52, 73, 94, 1)", "rgba(37, 116, 169, 1)", "rgba(92, 151, 191, 1)", "rgba(137, 196, 244, 1)", "rgba(82, 179, 217, 1)", "rgba(129, 207, 224, 1)", "rgba(197, 239, 247, 1)"]

    return (
      <div className="donutContainer">
        <svg className="donut" width={width} height={height}>
          <Donut x={x} y={y} radius={radius} data={this.props.data} colorScale={colorScale} />
        </svg>
        <DonutLegend data={this.props.data} colorScale={colorScale} />
      </div>
    );
  }
}

export default DonutWindow
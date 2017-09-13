import React from 'react'
import * as d3 from 'd3'
import Slice from './Slice.jsx'

class Donut extends React.Component {
  constructor(props) {
    super(props);
    // this.colorScale =  ["rgba(52, 73, 94, 1)", "rgba(37, 116, 169, 1)", "rgba(137, 196, 244, 1)", "rgba(82, 179, 217, 1)", "rgba(230, 126, 34 ,1)"]
    this.renderSlice = this.renderSlice.bind(this);
  }

  renderSlice(value, i) {
    // We'll create this component in a minute
    return (
      <Slice key={i}
             outerRadius={this.props.radius}
             innerRadius={this.props.radius * .70}
             value={value}
             label={value.data.payment_type}
             fill={this.props.colorScale[i]} 
      />
    );
  }

  render() {
    let {x, y, data} = this.props;
    let pie = d3.pie().value((data)=> {return data.sum})
    return (
      <g transform={`translate(${x}, ${y})`}>
        {/* Render a slice for each data point */}
        {pie(data).map(this.renderSlice)}
      </g>
    );
  }
}

export default Donut
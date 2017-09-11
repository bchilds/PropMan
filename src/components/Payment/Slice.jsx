import React from 'react'
import * as d3 from 'd3'

class Slice extends React.Component {
  render() {
    let {value, label, fill, innerRadius = 0, outerRadius} = this.props;
    // https://github.com/d3/d3/wiki/SVG-Shapes#arc
    let arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
    return (
      <g>
        <path d={arc(value)} fill={fill} />
        <text transform={`translate(${arc.centroid(value)})`}
              dy=".35em"
              textAnchor="middle"
              fill="white">
        </text>
      </g>
    );
  }
}

export default Slice
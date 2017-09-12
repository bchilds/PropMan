import React from 'react'
import * as d3 from 'd3'

class Slice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showLabel: false
    }
  }

  handleMouseEnter() {
    this.setState({
      showLabel: true
    })
  }

  handleMouseLeave() {
    this.setState({
      showLabel: false
    })
  }

  render() {
    let {value, label, fill, innerRadius = 0, outerRadius} = this.props;
    // https://github.com/d3/d3/wiki/SVG-Shapes#arc
    let arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
    return (
      <g>
        <path d={arc(value)} fill={fill} onMouseOver={this.handleMouseEnter.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}/>
        {this.state.showLabel && 
          <text transform={'translate(0,0)'}
                textAnchor="middle"
                fill="black"
                fontSize="25"
          >
          <tspan>{label}</tspan>
          <tspan x='0' dy='1.2em'>{`$${value.data.sum}`}</tspan>
          </text>
        }
      </g>
    );
  }
}

export default Slice
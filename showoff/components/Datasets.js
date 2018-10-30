import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container } from 'react-pixi-fiber'

import Circle from './Circle'

const getAngle = (angle, addition = 0) => (angle + addition) % 360
const updateAngle = (angle, depth) => getAngle(angle + 1 / 1e5 + depth / 1e5)
const toRadian = angle => (angle * 180) / Math.PI

export default class Datasets extends Component {
  static propTypes = {
    datasets: PropTypes.array,
    scale: PropTypes.object,
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }

  static defaultProps = {
    datasets: [],
  }

  state = {
    distance: 10,
    angle: 0,
  }

  componentWillReceiveProps() {
    this.orbit()
  }

  orbit = () => {
    const { datasets, z } = this.props

    if (!datasets.length) return

    const { angle } = this.state

    this.setState({ angle: updateAngle(angle, z) })
  }

  getOrbit(angle) {
    const { z } = this.props
    const { distance } = this.state
    return [
      Math.cos(toRadian(angle)) * (distance + z / 100),
      Math.sin(toRadian(angle)) * (distance + z / 100),
      Math.sin(toRadian(angle)) * (distance + z / 100),
    ]
  }

  putCircles() {
    const { datasets, z } = this.props
    const { angle } = this.state
    const { length } = datasets
    return datasets.map((dataset, index) => {
      const color = parseInt(dataset.color.slice(1), 16)
      const angle_ = getAngle(angle, (360 / length) * index)
      const [x, y] = this.getOrbit(angle_)
      return (
        <Circle
          key={dataset.slug}
          x={x}
          y={y}
          fill={color}
          radius={Math.max(0.3, 0.5 + z / 100)}
        />
      )
    })
  }

  render() {
    const { x, y, z } = this.props
    const { distance } = this.state
    return (
      <Container x={x} y={y} z={z}>
        <Circle
          x={0}
          y={0}
          z={0}
          lineStyle={[0.1, '0xffffff', 0.25, 0.5]}
          radius={distance + z / 100}
        />
        {this.putCircles()}
      </Container>
    )
  }
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Stage, Container } from 'react-pixi-fiber'
import randomColor from 'randomcolor'

import Circle from '../Circle'
import Cloud from './Cloud'
import random from '../../utils/random'

const getRandomColor = () =>
  parseInt(
    randomColor({ luminosity: 'light', hue: 'random' }).replace('#', '0x'),
    16,
  )

const adjust = opacity => {
  if (window.innerHeight <= 600) {
    opacity -= 0.5
  } else if (window.innerHeight <= 812) {
    opacity -= 0.3
  }
  return opacity
}

class ProductArt extends Component {
  static propTypes = {
    shouldDraw: PropTypes.bool,
  }

  static getCircles = (width, height) => {
    const circles = []
    for (let i = 0; i < Math.floor(width / 10); i++) {
      for (let j = 0; j < Math.floor(height / 10); j++) {
        const color = getRandomColor()
        circles.push([i * 20 + 10, j * 20 + 10, random(0, 5), color, adjust(1)])
      }
    }
    return circles
  }

  state = {
    circles: [],
    mask: null,
  }

  componentDidUpdate({ shouldDraw }) {
    if (!shouldDraw && this.props.shouldDraw) this.init()
    if (shouldDraw && !this.props.shouldDraw) this.setState({ circles: [] })
  }

  init() {
    const allCircles = _.shuffle(ProductArt.getCircles(600, 200))
    const next = ts => {
      const { circles } = this.state
      const rand = random(2, 10)
      if (circles.length + rand < allCircles.length) {
        this.setState({ circles: allCircles.slice(0, circles.length + rand) })
        requestAnimationFrame(next)
      }
    }
    requestAnimationFrame(next)
  }

  setMask = mask => {
    this.setState({ mask })
  }

  render() {
    const { circles, mask } = this.state
    const width = Math.min(500, window.innerWidth * 0.8)
    return (
      <Stage
        width={width}
        height={(width / 5) * 2}
        options={{ antialias: true, transparent: true }}
      >
        <Cloud
          ref={this.setMask}
          x={0}
          y={0}
          name="cloud-mask"
          width={width}
          height={(width / 5) * 2}
        />
        <Container mask={mask} name="product-art">
          {circles.map(([x, y, r, c, o], i) => (
            <Circle key={i} x={x} y={y} radius={r} fill={c} opacity={o} />
          ))}
        </Container>
      </Stage>
    )
  }
}

export default connect((state, { slug }) => ({
  shouldDraw:
    state.drawing.parallax.offset === 1 && !state.drawing.parallax.dirty,
}))(ProductArt)

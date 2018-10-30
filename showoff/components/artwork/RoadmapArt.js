import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Stage, Container } from 'react-pixi-fiber'
import randomColor from 'randomcolor'

import Circle from '../Circle'
import Line from '../Line'
import { roadmapDots } from './roadmapDots'
import random from '../../utils/random'

const getRandomColor = () =>
  parseInt(
    randomColor({ luminosity: 'light', hue: 'random' }).replace('#', '0x'),
    16,
  )

const adjust = opacity => {
  if (window.innerHeight >= 812) {
    opacity -= 0.5
  } else if (window.innerHeight >= 500) {
    opacity -= 0.7
  }
  return opacity
}

const getCircles = () => {
  return roadmapDots.map(([x, y]) => [
    x + 40 - 3.5,
    y - 3.5 + 10,
    random(2, 5),
    getRandomColor(),
  ])
}

const ALL_CIRCLES = getCircles()

class RoadmapArt extends Component {
  static propTypes = {
    shouldDraw: PropTypes.bool,
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
    let lastTs = 0
    const next = ts => {
      if (ts - lastTs < 20) {
        return requestAnimationFrame(next)
      }
      const { circles } = this.state
      if (circles.length < ALL_CIRCLES.length) {
        this.setState({ circles: ALL_CIRCLES.slice(0, circles.length + 1) })
        requestAnimationFrame(next)
      }
      lastTs = ts
    }
    next()
  }

  render() {
    const { circles } = this.state
    const last = ALL_CIRCLES[ALL_CIRCLES.length - 1]
    const opacity = adjust(1, -0.5, -0.8)
    return (
      <Stage
        width={500}
        height={120}
        options={{ antialias: true, transparent: true }}
      >
        <Container name="roadmap-art">
          {circles.map(([x, y, r], i) => (
            <Circle
              key={i}
              x={x}
              y={y}
              radius={r}
              lineStyle={[1, 0xffffff, 0.3]}
            />
          ))}
          {circles.map(
            ([x, y, r, c], i) =>
              Math.floor((circles.length * 6) / 7) > i && (
                <Circle
                  key={i}
                  x={x}
                  y={y}
                  radius={r}
                  fill={c}
                  opacity={opacity}
                />
              ),
          )}
          {circles.length === ALL_CIRCLES.length && (
            <Line
              from={{ x: last[0] - 10, y: last[1] - 7 }}
              to={{ x: last[0] + 13, y: last[1] + 11 }}
              fill={0xaf2828}
              opacity={1}
              scale={{ x: 0.4, y: 0.4 }}
            />
          )}
          {circles.length === ALL_CIRCLES.length && (
            <Line
              from={{ x: last[0] + 10, y: last[1] - 13 }}
              to={{ x: last[0] - 7, y: last[1] + 7 }}
              fill={0xaf2828}
              opacity={1}
              scale={{ x: 0.4, y: 0.4 }}
            />
          )}
        </Container>
      </Stage>
    )
  }
}

export default connect((state, { slug }) => ({
  shouldDraw:
    state.drawing.parallax.offset === 5 && !state.drawing.parallax.dirty,
}))(RoadmapArt)

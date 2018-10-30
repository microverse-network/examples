import React from 'react'
import PropTypes from 'prop-types'
import Line from './Line'
import { easeInSine as ease } from '../utils/easings'

import { STEPS } from './CustomPath'

export default class AnimatedLine extends React.Component {
  static propTypes = {
    to: PropTypes.object,
    from: PropTypes.object,
    fill: PropTypes.number,
    steps: PropTypes.number,
    scale: PropTypes.object,
    opacity: PropTypes.number,
    lineWidth: PropTypes.number,
    onLineDrawn: PropTypes.func,
    onLineReversed: PropTypes.func,
    reversed: PropTypes.bool,
    shouldDraw: PropTypes.bool,
  }

  static defaultProps = {
    steps: STEPS,
    onLineDrawn: () => {},
    onLineReversed: () => {},
  }

  state = {
    step: 0,
    percentage: { x: 0, y: 0 },
  }

  componentWillUnmount() {
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true
    this.animate()
  }

  reinit() {
    this.setState({ step: 0, percentage: { x: 0, y: 0 } })
    this.animate()
  }

  componentDidUpdate(prevProps) {
    const { reversed, from, shouldDraw } = this.props
    if (prevProps.from.id !== from.id) return this.reinit()
    if (!prevProps.shouldDraw && shouldDraw) return this.animate()
    if (!prevProps.reversed && reversed) return this.animate()
  }

  animate() {
    const { onLineDrawn, onLineReversed } = this.props
    const next = () => {
      const { shouldDraw, steps, reversed } = this.props
      if (!shouldDraw) return
      if (!this.mounted) return
      const { step } = this.state
      if (step === (reversed ? 0 : steps)) {
        return reversed ? onLineReversed() : onLineDrawn()
      }
      const newStep = reversed ? step - 1 : step + 1
      const percentage = {
        x: ease(newStep, 0, 1, STEPS),
        y: ease(newStep, 0, 1, STEPS),
      }
      this.setState({ percentage, step: newStep }, () =>
        requestAnimationFrame(next),
      )
    }
    next()
  }

  render() {
    const { from, to, fill, scale, opacity, lineWidth } = this.props
    const { percentage } = this.state

    const current = {
      x: from.x + (to.x - from.x) * percentage.x,
      y: from.y + (to.y - from.y) * percentage.y,
    }

    return (
      <Line
        from={from}
        to={current}
        fill={fill}
        scale={scale}
        opacity={opacity}
        lineWidth={lineWidth}
      />
    )
  }
}

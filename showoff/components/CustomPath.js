import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Container } from 'react-pixi-fiber'

import Stars from './Stars'
import Edges from './Edges'

export const STEPS = 5

export default class CustomPath extends Component {
  static propTypes = {
    path: PropTypes.array,
    fill: PropTypes.number,
    scale: PropTypes.object,
    opacity: PropTypes.number,
    animated: PropTypes.bool,
    roundTrip: PropTypes.bool,
    lineWidth: PropTypes.number,
    onAllLinesDrawn: PropTypes.func,
    onAllLinesReversed: PropTypes.func,
  }

  static defaultProps = {
    opacity: 1,
    fill: 0xff0000,
    animated: false,
    onAllLinesDrawn: () => {},
    onAllLinesReversed: () => {},
  }

  state = {
    reversed: false,
    lineAmount: 1,
    lines: [],
    stars: [],
  }

  reset() {
    this.setState({
      reversed: false,
      lineAmount: 1,
      lines: [],
      stars: [],
    })
  }

  componentWillUnmount() {
    this.mounted = false
    clearTimeout(this.timer)
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillReceiveProps(props) {
    const { path } = props
    const nextIds = path.map(n => n.id).join()
    const currentIds = this.props.path.map(n => n.id).join()

    if (nextIds !== currentIds) this.reset()
    return this.prepareLines(path)
  }

  // converting to componentDidUpdate
  // didn't work for some reason

  // componentDidUpdate(prevProps) {
  //   const currentIds = this.props.path.map(n => n.id).join()
  //   const pastIds = prevProps.path.map(n => n.id).join()
  //   if (currentIds !== pastIds) {
  //     this.reset()
  //     this.prepareLines()
  //     console.log(currentIds, pastIds)
  //   }
  // }

  onAllLinesDrawn = () => {
    const { roundTrip, onAllLinesDrawn, path } = this.props
    if (roundTrip) {
      this.timer = setTimeout(() => this.setState({ reversed: true }), 500)
    }
    onAllLinesDrawn(path)
  }

  onAllLinesReversed = () => {
    const { onAllLinesReversed, path } = this.props
    onAllLinesReversed(path)
  }

  onLineDrawn = () => {
    const { lineAmount } = this.state
    const { path } = this.props
    if (lineAmount === path.length - 1) return this.onAllLinesDrawn()
    this.setState({ lineAmount: lineAmount + 1 })
  }

  onLineReversed = () => {
    const { lineAmount } = this.state
    this.setState({ lineAmount: lineAmount - 1 })
    if (lineAmount === 1) this.onAllLinesReversed()
  }

  prepareLines(path) {
    const lines = path.reduce((lines, _, index) => {
      if (index === 0) return lines

      return [
        ...lines,
        {
          from: path[index - 1],
          to: path[index],
        },
      ]
    }, [])
    const finishedAnimatedLines = this.props.animated
      ? this.state.lineAmount
      : lines.length
    this.setState({ lines: lines.slice(0, finishedAnimatedLines) })
  }

  render() {
    const { animated, path, fill, scale, opacity, lineWidth } = this.props
    const { lines, reversed, lineAmount } = this.state
    const nodes = path.slice(0, lineAmount)
    return (
      <Container name="compute-path">
        <Stars fill={fill} nodes={nodes} scale={scale} opacity={opacity} />
        <Edges
          fill={fill}
          edges={lines}
          scale={scale}
          opacity={opacity}
          animated={animated}
          reversed={animated && reversed}
          onLineDrawn={this.onLineDrawn}
          onLineReversed={this.onLineReversed}
          lineWidth={lineWidth}
        />
      </Container>
    )
  }
}

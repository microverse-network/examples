import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container } from 'react-pixi-fiber'

import Line from './Line'
import AnimatedLine from './AnimatedLine'

class Edges extends React.Component {
  static propTypes = {
    edges: PropTypes.array,
    fill: PropTypes.number,
    scale: PropTypes.object,
    opacity: PropTypes.number,
    animated: PropTypes.bool,
    reversed: PropTypes.bool,
    lineWidth: PropTypes.number,
    shouldDraw: PropTypes.bool,
    onLineDrawn: PropTypes.func,
    onLineReversed: PropTypes.func,
  }

  static defaultProps = {
    fill: 0xffffff,
    animated: false,
  }

  render() {
    const {
      edges,
      fill,
      scale,
      opacity,
      animated,
      onLineDrawn,
      onLineReversed,
      reversed,
      shouldDraw,
      lineWidth,
    } = this.props

    const Line_ = animated ? AnimatedLine : Line

    return (
      <Container name="edges">
        {edges.map((edge, index) => (
          <Line_
            key={`${index}_${edge.from.id}_${edge.to.id}`}
            from={edge.from}
            to={edge.to}
            fill={fill}
            scale={scale}
            opacity={opacity}
            lineWidth={lineWidth}
            onLineDrawn={onLineDrawn}
            onLineReversed={onLineReversed}
            reversed={reversed && edges.length - 1 === index}
            shouldDraw={shouldDraw}
          />
        ))}
      </Container>
    )
  }
}

export default connect((state, { slug }) => ({
  shouldDraw: state.drawing.shouldDraw,
}))(Edges)

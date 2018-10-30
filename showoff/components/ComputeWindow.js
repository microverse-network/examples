import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GameWindow from './GameWindow'

import ComputeInner from './ComputeInner'

export default class ComputeWindow extends Component {
  static propTypes = {
    left: PropTypes.number,
    peer: PropTypes.object,
    bottom: PropTypes.number,
    onClose: PropTypes.func,
    clusters: PropTypes.object,
    services: PropTypes.array,
    onExecute: PropTypes.func,
  }

  static defaultProps = {
    left: 10,
    bottom: 110,
  }

  render() {
    const { left, bottom, services, onExecute, onClose, clusters } = this.props

    return (
      <GameWindow left={left} bottom={bottom} onClose={onClose}>
        <ComputeInner
          services={services}
          onExecute={onExecute}
          clusters={clusters}
        />
      </GameWindow>
    )
  }
}

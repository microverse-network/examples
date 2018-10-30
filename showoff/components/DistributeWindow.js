import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DistributeData from './DistributeData'
import GameWindow from './GameWindow'

export default class DistributeWindow extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onReset: PropTypes.func,
    onDistribute: PropTypes.func,
    left: PropTypes.number,
    bottom: PropTypes.number,
    clusters: PropTypes.object,
  }

  static defaultProps = {
    left: 10,
    bottom: 110,
  }

  render() {
    const {
      left,
      bottom,
      onDistribute,
      onClose,
      onReset,
      clusters,
    } = this.props

    return (
      <GameWindow left={left} bottom={bottom} onClose={onClose}>
        <DistributeData
          onReset={onReset}
          onDistribute={onDistribute}
          clusters={clusters}
        />
      </GameWindow>
    )
  }
}

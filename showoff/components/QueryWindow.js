import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QueryData from './QueryData'
import GameWindow from './GameWindow'

export default class QueryWindow extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onReset: PropTypes.func,
    onQuery: PropTypes.func,
    query: PropTypes.object,
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
      onQuery,
      onClose,
      onReset,
      clusters,
      query,
    } = this.props

    return (
      <GameWindow left={left} bottom={bottom} onClose={onClose} className="in">
        <QueryData
          query={query}
          onReset={onReset}
          onQuery={onQuery}
          clusters={clusters}
        />
      </GameWindow>
    )
  }
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Divider, Relative } from 'rebass'

import GameWindow from './GameWindow'
import QueryData from './QueryData'
import ComputeInner from './ComputeInner'
import { Heading } from './Boxes'

export default class TryWindow extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onReset: PropTypes.func,
    onQuery: PropTypes.func,
    onExecute: PropTypes.func,
    query: PropTypes.object,
    left: PropTypes.number,
    bottom: PropTypes.number,
    clusters: PropTypes.object,
    services: PropTypes.array,
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
      onExecute,
      services,
      clusters,
      query,
    } = this.props

    return (
      <GameWindow left={left} bottom={bottom} onClose={onClose} className="in">
        <Relative style={{ marginLeft: 32 }}>
          <Heading my={3} fontSize={1}>
            Try Compute & Database
          </Heading>
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <ComputeInner
            noTitle
            services={services}
            onExecute={onExecute}
            clusters={clusters}
          />
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <QueryData
            noTitle
            query={query}
            onReset={onReset}
            onQuery={onQuery}
            clusters={clusters}
          />
        </Relative>
      </GameWindow>
    )
  }
}

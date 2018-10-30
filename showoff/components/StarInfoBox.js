import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Text } from 'react-pixi-fiber'
import Rectangle from './Rectangle'

export default class StarInfoBox extends Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    node: PropTypes.object,
    scale: PropTypes.object,
    click: PropTypes.func,
  }

  render() {
    const { x, y, node, scale, click } = this.props

    const skale = { x: 1 / scale.x, y: 1 / scale.y }
    const { id, clusterId, connections = [], runtimeInfo = {} } = node
    const lines = [
      `${'ID'.padEnd(14, '.')}: ${id}`,
      `${'Cluster ID'.padEnd(14, '.')}: ${clusterId}`,
      `${'Connections'.padEnd(14, '.')}: ${connections.join('') || '-'}`,
      // `${'Stored objects'.padEnd(14, '.')}: ${objectCount}`,
      `${'Memory'.padEnd(14, '.')}: ${runtimeInfo.deviceMemory || '-'}`,
      `${'Platform'.padEnd(14, '.')}: ${runtimeInfo.platform || '-'}`,
      `${'Browser'.padEnd(14, '.')}: ${runtimeInfo.name || '-'}`,
    ]
    const content = lines.join('\n')

    return (
      <Container name="infobox" buttonMode interactive click={click}>
        <Text
          x={x + 30 / scale.x}
          y={y - 150 / scale.y}
          text={content}
          style={{
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: 13,
            lineHeight: 20,
            fill: 0xffffff,
          }}
          scale={skale}
        />
        <Rectangle
          x={x + 10 / scale.x}
          y={y - 170 / scale.y}
          lineWidth={1 / scale.x}
          lineColor={0xffffff}
          fill={0xffffff}
          alpha={0.1}
          radius={10 / scale.x}
          width={300 / scale.x}
          height={170 / scale.y}
          scale={skale}
        />
      </Container>
    )
  }
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text, Container } from 'react-pixi-fiber'
import numeral from 'numeral'

import Rectangle from './Rectangle'
import random from '../utils/random'

const DROP_SHADOW = {
  dropShadow: true,
  dropShadowBlur: 5,
  dropShadowAlpha: 0.4,
  dropShadowAngle: Math.PI / 2,
  dropShadowDistance: 2,
}

class ClusterStats extends Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    scale: PropTypes.object,
    height: PropTypes.number,
    mchs: PropTypes.number,
    cluster: PropTypes.object,
    clusterId: PropTypes.string,
    nodes: PropTypes.object,
    services: PropTypes.array,
    onTryClick: PropTypes.func,
    activeWindow: PropTypes.string,
    shouldDraw: PropTypes.bool,
  }

  state = {
    workers: 0,
    distributedMCH: 0,
    nodeCount: 0,
    serviceCount: 0,
    mchCount: 0,
  }

  componentDidUpdate(prevProps) {
    const { services, nodes, mchs } = this.props

    if (
      prevProps.activeWindow === 'TryWindow' &&
      this.props.activeWindow !== 'TryWindow'
    ) {
      this.animateCount('mch')
      this.animateCount('node')
      this.animateCount('service')
    }

    if (services.length !== prevProps.services.length) {
      this.animateCount('service')
    }

    if (mchs !== prevProps.mchs) {
      this.animateCount('mch')
    }

    if (Object.keys(nodes).length !== Object.keys(prevProps.nodes).length) {
      this.animateCount('node')
    }
  }

  animateCount = type => {
    const next = () => {
      const { shouldDraw } = this.props
      if (!shouldDraw) return requestAnimationFrame(next)
      const key = `${type}Count`
      const items = this.props[`${type}s`]
      const current = this.state[key]
      const final =
        typeof items === 'number'
          ? items
          : Array.isArray(items)
            ? items.length
            : Object.keys(items).length
      const diff = final - current
      const step =
        diff > 50 ? random(1, Math.floor(diff / 10)) : diff > 1 ? 1 : diff
      if (final > current) {
        this.setState({ [key]: current + step })
        requestAnimationFrame(next)
      } else if (final < current) {
        const step =
          diff < -50 ? random(1, Math.floor(-diff / 10)) : diff < 1 ? diff : 1
        this.setState({ [key]: current - step })
        requestAnimationFrame(next)
      }
    }
    next()
  }

  render() {
    const { nodeCount, serviceCount, mchCount } = this.state
    const { activeWindow, scale, y, onTryClick } = this.props
    return (
      <Container name="cluster-stats" interactive x={-200} y={y} scale={scale}>
        {activeWindow === 'TryWindow' && (
          <Stat title="NODES:" stat={numeral(nodeCount).format('0,0')} />
        )}
        {activeWindow === 'TryWindow' && (
          <Stat
            x={80}
            title="SERVICES:"
            stat={numeral(serviceCount).format('0,0')}
          />
        )}
        {activeWindow === 'TryWindow' && (
          <Stat
            x={160}
            title="DISTRIBUTED MCH:"
            stat={numeral(mchCount).format('0,0.0000')}
          />
        )}
        {activeWindow === 'DONT SHOW THIS' && (
          <Button x={0} y={60} click={onTryClick} title="TRY MICROVERSE" />
        )}
      </Container>
    )
  }
}

const Stat = ({ title, stat, x }) => {
  const fill = 0xffffff
  const style = {
    ...DROP_SHADOW,
    fontSize: 32,
    fill,
    fontFamily: 'aktiv-grotesk-thin',
  }
  const styleLabel = {
    ...style,
    fontSize: 12,
    fontFamily: [
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace',
    ],
  }

  return (
    <Container x={x}>
      <Text alpha={0.375} style={styleLabel} text={title} />
      <Text y={17} style={style} text={stat} />
    </Container>
  )
}

Stat.propTypes = {
  title: PropTypes.string,
  stat: PropTypes.string,
  x: PropTypes.number,
}

const Button = ({ title, x, y, click }) => {
  const fill = 0xffffff
  const style = {
    ...DROP_SHADOW,
    fontSize: 12,
    fill,
    letterSpacing: 1,
    fontFamily: 'aktiv-grotesk-thin',
  }

  return (
    <Container interactive buttonMode click={click} anchor={[0.5, 0.5]}>
      <Text style={style} text={title} y={y + 8} x={x + 17} />
      <Rectangle
        x={x}
        y={y}
        lineWidth={1}
        lineColor={0xffffff}
        fill={0xffffff}
        alpha={0.001}
        width={145}
        height={31}
      />
    </Container>
  )
}

Button.propTypes = {
  title: PropTypes.string,
  click: PropTypes.func,
  x: PropTypes.number,
  y: PropTypes.number,
}

export default connect(state => ({
  mchs: state.mch.distributed,
  nodes: state.microverse.nodes,
  services: state.compute.services,
  activeWindow: state.windowPlacements.active,
  shouldDraw: state.drawing.shouldDraw,
}))(ClusterStats)

import React, { Component } from 'react'
import { Container, Text } from 'react-pixi-fiber'
import PropTypes from 'prop-types'

import Circle from './Circle'
import Line from './Line'
import { easeInOutBack } from '../utils/easings'
import { getRelativeCoords } from '../utils/coords'

export default class Dataset extends Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
    scale: PropTypes.object.isRequired,
    nodes: PropTypes.array.isRequired,
    dataset: PropTypes.object.isRequired,
    distribute: PropTypes.func.isRequired,
    clusterCheck: PropTypes.func.isRequired,
    getClusterPosition: PropTypes.func.isRequired,
  }

  state = {
    lineActive: false,
    from: { x: 0, y: 0 },
    to: { x: 0, y: 0 },
    lineColor: null,
    bullets: [],
    hover: false,
  }

  onNativeMove = event => {
    const { scale, clusterCheck } = this.props
    const globalPos = this.circle.getGlobalPosition()
    const to = getRelativeCoords(
      globalPos,
      {
        x: event.clientX,
        y: event.clientY,
      },
      scale,
    )

    const overlaps = clusterCheck(event.clientX, event.clientY)
    let lineColor
    if (overlaps.length) {
      lineColor = 0xff0000
    }
    this.setState({ to, lineColor })
  }

  onClickWhileNativeMoving = event => {
    event.stopPropagation()
    const {
      clusterCheck,
      distribute,
      dataset: { slug },
    } = this.props

    const overlaps = clusterCheck(event.clientX, event.clientY)
    if (overlaps.length) {
      distribute(overlaps, slug)
      this.cancelNativeMovement(event)
    }
  }

  cancelNativeMovement = event => {
    // don't show the context menu
    event.preventDefault()
    // let the click handler cancel the movement
    this.onClick(event)
  }

  onClick = event => {
    const { lineActive } = this.state

    if (!lineActive) {
      document.addEventListener('mousemove', this.onNativeMove)
      document.addEventListener('click', this.onClickWhileNativeMoving, true)
      document.addEventListener('contextmenu', this.cancelNativeMovement)
    } else {
      // cancel overlap calculation
      this.props.clusterCheck(0, 0, true)
      document.removeEventListener('mousemove', this.onNativeMove)
      document.removeEventListener('click', this.onClickWhileNativeMoving, true)
      document.removeEventListener('contextmenu', this.cancelNativeMovement)
    }

    this.setState({ to: { x: 0, y: 0 }, lineActive: !lineActive })
  }

  onMouseOver = event => this.setState({ hover: true })

  onMouseOut = event => this.setState({ hover: false })

  componentWillReceiveProps(nextProps) {
    const {
      dataset: { nodes },
    } = this.props
    const {
      dataset: { nodes: nextNodes },
    } = nextProps

    if (nextNodes.length > nodes.length) {
      const difference = nextNodes.filter(n => !nodes.includes(n))
      this.fire(difference[0])
    }
  }

  fire(targetNodeId) {
    const { getClusterPosition } = this.props
    const { bullets } = this.state
    const current = { x: 0, y: 0 }
    const bullet = { current, id: targetNodeId, step: 0, radius: 0 }
    this.setState({ bullets: { ...bullets, [targetNodeId]: bullet } })
    const next = id => {
      const { nodes, x, y } = this.props
      const { bullets } = this.state
      const bullet = bullets[id]
      const { current } = bullet
      const node = nodes.find(n => n.id === targetNodeId)
      if (!node) {
        delete bullets[id]
        this.setState({ bullets })
        return
      }

      const clusterPosition = getClusterPosition(node.clusterId)

      const final = {
        x: node.x - x + clusterPosition.x + clusterPosition.width / 2,
        y: node.y - y + clusterPosition.y + clusterPosition.height / 2,
      }
      let { step } = bullet
      if (step <= 100) {
        current.x = easeInOutBack(step++, 0, final.x, 100)
        current.y = easeInOutBack(step, 0, final.y, 100)
        const initialRadius = this.props.dataset.radius / 5
        const radius = Math.max(
          initialRadius - easeInOutBack(step, 0, initialRadius, 100),
          2,
        )
        this.setState({
          bullets: { ...bullets, [id]: { current, id, step, radius } },
        })
        requestAnimationFrame(next.bind(this, id))
      } else {
        delete bullets[id]
        this.setState({ bullets })
      }
    }

    requestAnimationFrame(next.bind(this, targetNodeId))
  }

  render() {
    const { dataset, x, y, z, scale } = this.props
    const { color, name, radius } = dataset
    const { lineColor, lineActive, to, from, bullets } = this.state
    const skale = { x: 1 / scale.x, y: 1 / scale.y }
    const color_ = parseInt(color.replace('#', '0x'), 16)

    return (
      <Container x={x} y={y} z={z} name="dataset">
        {lineActive && (
          <Line
            fill={lineColor || color_}
            from={from}
            to={to}
            scale={scale}
            name="fire-line"
            opacity={1}
          />
        )}
        <Circle
          interactive
          ref={c => (this.circle = c)}
          fill={color_}
          radius={radius}
          onClick={this.onClick}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
        />
        <Text
          y={radius + 20 * skale.y}
          anchor={[0.5, 0.5]}
          text={name}
          scale={skale}
          style={{
            dropShadow: true,
            dropShadowAlpha: 0.4,
            dropShadowAngle: Math.PI / 2,
            dropShadowDistance: 2,
            dropShadowBlur: 5,
            fontSize: 16,
            fill: 0xffffff,
            fontFamily: 'aktiv-grotesk-thin',
          }}
        />
        {this.state.hover && (
          <Text
            y={radius + 40 * skale.y}
            anchor={[0.5, 0.5]}
            text="Click and point to a cluster!"
            scale={skale}
            style={{
              dropShadow: true,
              dropShadowAlpha: 0.4,
              dropShadowAngle: Math.PI / 2,
              dropShadowDistance: 2,
              dropShadowBlur: 5,
              fontSize: 12,
              fill: 0xffffff99,
              fontFamily: 'aktiv-grotesk-thin',
            }}
          />
        )}
        {Object.values(bullets).map(bullet => {
          return (
            <Circle
              key={bullet.id}
              fill={color_}
              radius={bullet.radius}
              x={bullet.current.x}
              y={bullet.current.y}
            />
          )
        })}
      </Container>
    )
  }
}

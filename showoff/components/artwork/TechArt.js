import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import shortid from 'shortid'
import { Stage } from 'react-pixi-fiber'
import {
  generateNodes,
  generateNode,
} from '@microverse-network/redux/src/utils'
import Graph from 'ngraph.graph'
import Layout from 'ngraph.forcelayout3d'
import ClusterContainer from '../ClusterContainer'

const physicsSettings = {
  springLength: 5,
  springCoeff: 0.001,
  gravity: -1.2,
  theta: 0.8,
  dragCoeff: 0.02,
  timeStep: 10,
}

// const TEXT_STYLE = {
//   dropShadow: true,
//   dropShadowBlur: 15,
//   dropShadowAlpha: 0.4,
//   dropShadowAngle: Math.PI / 2,
//   dropShadowDistance: 0,
//   dropShadowColor: 0x00ff00,
//   fontSize: 48,
//   fill: 0x00ff00,
//   fontFamily: [
//     'SFMono-Regular',
//     'Menlo',
//     'Monaco',
//     'Consolas',
//     'Liberation Mono',
//     'Courier New',
//     'monospace',
//   ],
// }

class TechArt extends Component {
  static propTypes = {
    shouldDraw: PropTypes.bool,
    instance: PropTypes.object,
    x: PropTypes.number,
    y: PropTypes.number,
    lineColor: PropTypes.number,
    starColor: PropTypes.number,
    count: PropTypes.number,
  }

  static defaultProps = {
    lineColor: 0xffffff,
    starColor: 0xffffff,
    count: 30,
  }

  state = {
    clusterId: null,
    graph: Graph(),
  }

  componentDidUpdate({ shouldDraw }) {
    if (!shouldDraw && this.props.shouldDraw) this.init()
    if (shouldDraw && !this.props.shouldDraw) {
      const { graph } = this.state
      graph.clear()
    }
  }

  init() {
    const { instance, count } = this.props
    const { graph } = this.state
    const clusterId = shortid.generate()
    const layout = this.state.layout || Layout(graph, physicsSettings)
    if (!this.state.layout) this.setState({ layout, clusterId })
    const fromNode = { node: generateNode(clusterId), instance }
    const { nodes, connections } = generateNodes(null, null, fromNode, count)

    nodes.forEach(({ node, instance }) => {
      if (!node.clusterId) return
      if (!graph.getNode(node._id)) graph.addNode(node._id, node)
      if (node._id === instance._id) {
        layout.pinNode(graph.getNode(node._id), true)
      }
    })

    connections.forEach(({ from, to }) => {
      if (!from.clusterId) return
      graph.addLink(from._id, to._id)
    })
  }

  render() {
    const { shouldDraw, x, y, lineColor, starColor } = this.props
    const { clusterId, graph, layout } = this.state
    return (
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        options={{ antialias: true, transparent: true }}
      >
        <ClusterContainer
          clusterId={clusterId}
          x={x}
          y={y}
          graph={graph}
          layout={layout}
          scale={{ x: 1, y: 1 }}
          showClusterStats={false}
          shouldDraw={shouldDraw}
          lineColor={lineColor}
          starColor={starColor}
        />
      </Stage>
    )
  }
}

export default connect((state, { slug }) => ({
  instance:
    state.microverse.instances[Object.keys(state.microverse.instances)[0]],
  shouldDraw:
    state.drawing.parallax.offset === 3 && !state.drawing.parallax.dirty,
}))(TechArt)

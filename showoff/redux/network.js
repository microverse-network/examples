import Graph from 'ngraph.graph'
import Layout from 'ngraph.forcelayout3d'

import {
  ADD_NODE,
  ADD_NODES,
  REMOVE_NODE,
  ADD_CONNECTION,
  ADD_CONNECTIONS,
  ADD_CLUSTER,
} from '@microverse-network/redux'

const physicsSettings = {
  springLength: 5,
  springCoeff: 0.001,
  gravity: -1.2,
  theta: 0.8,
  dragCoeff: 0.02,
  timeStep: 10,
}

export const reducer = (state = {}, { type, payload } = {}) => {
  switch (type) {
    case ADD_NODE: {
      const { node, instance } = payload

      if (!node.clusterId) return state

      const { graph, layout } = state[node.clusterId]

      if (!graph.getNode(node._id)) {
        graph.addNode(node._id, node)
      }

      if (node._id === instance._id) {
        layout.pinNode(graph.getNode(node._id), true)
      }

      return { ...state }
    }

    case ADD_NODES: {
      const { nodes } = payload

      nodes.forEach(({ node, instance }) => {
        if (!node.clusterId) return state

        const { graph, layout } = state[node.clusterId]

        if (!graph.getNode(node._id)) {
          graph.addNode(node._id, node)
        }

        if (node._id === instance._id) {
          layout.pinNode(graph.getNode(node._id), true)
        }
      })

      return { ...state }
    }

    case REMOVE_NODE: {
      const { node } = payload

      if (!node.clusterId) return state

      const { graph } = state[node.clusterId]

      graph.forEachLinkedNode(node._id, (linkedNode, link) => {
        graph.removeLink(link)
      })
      graph.removeNode(node._id)

      return { ...state }
    }

    case ADD_CONNECTION: {
      const { from, to } = payload

      if (!from.clusterId) return state

      const { graph } = state[from.clusterId]

      graph.addLink(from._id, to._id)

      return { ...state }
    }

    case ADD_CONNECTIONS: {
      const { connections } = payload
      connections.forEach(({ from, to }) => {
        if (!from.clusterId) return state

        const { graph } = state[from.clusterId]

        graph.addLink(from._id, to._id)
      })

      return { ...state }
    }

    case ADD_CLUSTER: {
      let { id, graph } = payload
      if (state[id]) return state

      graph = graph || Graph()
      const layout = Layout(graph, physicsSettings)
      return { ...state, [id]: { graph, layout } }
    }
  }

  return state
}

export const clusterCoordinates = ({ network }) => {
  return Object.keys(network).map((clusterId, i) => {
    const { innerWidth, innerHeight } = window
    const { layout } = network[clusterId]

    const rect = layout.getGraphRect()

    const x = innerWidth / 2 + i * 200
    const y = innerHeight / 2 + i * 200
    const width = rect.x2 - rect.x1
    const height = rect.y2 - rect.y1

    return { clusterId, x, y, width, height }
  })
}

export const clusterCounts = ({ network, microverse, distribute }) => {
  return Object.keys(network).map(clusterId => {
    const nodes = Object.values(microverse.nodes).filter(
      n => n.clusterId === clusterId,
    )
    return {
      clusterId,
      nodes: nodes.length,
      total:
        nodes.length *
        (nodes.length +
          distribute.distributions.length +
          Object.keys(distribute.datasets).length),
    }
  })
}

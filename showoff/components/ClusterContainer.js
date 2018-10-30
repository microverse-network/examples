import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Container } from 'react-pixi-fiber'
import randomColor from 'randomcolor'
import { aStar } from 'ngraph.path'

import Stars from './Stars'
import Edges from './Edges'
import CustomPath from './CustomPath'
import ClusterStats from './ClusterStats'
import random from '../utils/random'

import { logCall } from '../redux/logs'
const EARN_PATH_COUNT = 10

const pathIds = path => path.map(({ id }) => id).join('')
const parseColor = color => parseInt(color.replace('#', '0x'), 16)

class ClusterContainer extends Component {
  static propTypes = {
    layout: PropTypes.object,
    graph: PropTypes.object,
    x: PropTypes.number,
    y: PropTypes.number,
    clusterId: PropTypes.string,
    scale: PropTypes.object,
    peerId: PropTypes.string,
    cluster: PropTypes.object,
    datasets: PropTypes.object,
    computedPath: PropTypes.array,
    queriedPath: PropTypes.array,
    query: PropTypes.object,
    counts: PropTypes.object,
    hasOverlap: PropTypes.bool,
    showClusterStats: PropTypes.bool,
    onMount: PropTypes.func,
    delta: PropTypes.object,
    compute: PropTypes.object,
    logCall: PropTypes.func,
    onTryClick: PropTypes.func,
    activeWindow: PropTypes.string,
    shouldDraw: PropTypes.bool,
    offset: PropTypes.number,
    lineColor: PropTypes.number,
    starColor: PropTypes.number,
  }

  static defaultProps = {
    showClusterStats: true,
    compute: {},
    query: {},
  }

  state = {
    nodes: [],
    edges: [],
    computePath: [],
    queryPath: [],
    earnedPaths: [],
    earnPaths: [],
    height: 0,
  }

  componentDidUpdate(prevProps) {
    const { query, compute, offset, shouldDraw } = this.props
    if (offset === 0 && shouldDraw && !prevProps.shouldDraw) {
      this.prepareActiveCalls()
    }
    if (!prevProps.query.active && query.active) {
      this.setState({ queryPath: [] })
    }
    if (!prevProps.compute.active && compute.active) {
      this.setState({ computePath: [] })
    }
  }

  getAnEarnPath(to) {
    const { graph, logCall } = this.props
    const nodes = []
    graph.forEachNode(node => {
      nodes.push(node)
    })

    const color_ = randomColor({ luminosity: 'light', hue: 'random' })
    const color = parseInt(color_.replace('#', '0x'), 16)

    const path = { path: [], color }
    if (!nodes.length) return path

    to = to || nodes[random(0, nodes.length - 1)].id
    const from = nodes[random(0, nodes.length - 1)].id
    const pathFinder = aStar(graph)

    try {
      path.path = pathFinder.find(from, to)
    } catch (e) {
      path.path = []
    }

    if (path.path.length > 2) {
      logCall({ log: { from, to, color: color_ }, type: 'calls' })
    }

    return path
  }

  prepareActiveCalls = () => {
    if (this.props.offset) return
    const { earnedPaths } = this.state
    if (EARN_PATH_COUNT > earnedPaths.length) {
      const earnedPath = this.getAnEarnPath()
      if (earnedPath.path.length > 2) earnedPaths.push(earnedPath)
    }
    this.setState({ earnedPaths })
    setTimeout(this.prepareActiveCalls, random(1500, 3000))
  }

  callFinished = finishedPath => {
    let { earnedPaths } = this.state
    earnedPaths = earnedPaths.reduce((paths, { path, color }) => {
      if (pathIds(finishedPath) === pathIds(path)) return paths
      paths.push({ path, color })
      return paths
    }, [])
    this.setState({ earnedPaths })
  }

  componentDidMount() {
    const { offset, shouldDraw } = this.props
    if (offset === 0 && shouldDraw) this.prepareActiveCalls()

    const next = () => {
      const { shouldDraw } = this.props
      if (!shouldDraw) return requestAnimationFrame(next)
      const { layout, graph, clusterId, computedPath, queriedPath } = this.props

      layout.step()

      const { y1, y2 } = layout.getGraphRect()
      const height = y2 - y1

      const clusterNodes = []
      graph.forEachNode(node => {
        const { id } = node
        const { x, y, z } = layout.getNodePosition(id)
        clusterNodes.push({
          ...node.data,
          x,
          y,
          z,
          clusterId,
        })
      })

      const clusterEdges = []
      graph.forEachLink(link => {
        const { id } = link
        const { from, to } = layout.getLinkPosition(id)
        clusterEdges.push({
          from: { x: from.x, y: from.y },
          to: { x: to.x, y: to.y },
          clusterId,
        })
      })

      let { computePath, queryPath, earnedPaths } = this.state
      let earnPaths = []

      if (computedPath) {
        computePath = computedPath.map(({ id }) => ({
          ...layout.getNodePosition(id),
          id,
        }))
      }

      if (queriedPath) {
        queryPath = queriedPath.map(({ id }) => ({
          ...layout.getNodePosition(id),
          id,
        }))
      }

      if (earnedPaths.length) {
        earnPaths = earnedPaths.map(({ path, color }) => ({
          path: path.map(({ id }) => ({
            ...layout.getNodePosition(id),
            id,
          })),
          color,
        }))
      }

      this.setState(
        {
          nodes: clusterNodes,
          edges: clusterEdges,
          height,
          computePath,
          queryPath,
          earnPaths,
        },
        () => {
          requestAnimationFrame(next)
        },
      )
    }

    requestAnimationFrame(next)
  }

  render() {
    const {
      x,
      y,
      clusterId,
      scale,
      peerId,
      cluster,
      datasets,
      query,
      onMount,
      compute,
      showClusterStats,
      onTryClick,
      activeWindow,
      delta = { x: 0, y: 0 },
      starColor,
      lineColor,
    } = this.props

    const {
      nodes,
      edges,
      height,
      computePath,
      queryPath,
      earnPaths,
    } = this.state

    const fill = starColor || 0xe8f6ff
    const skale = { x: 1 / scale.x, y: 1 / scale.y }
    const showCompute = compute.active && activeWindow === 'TryWindow'
    const showQuery = query.active && activeWindow === 'TryWindow'

    return (
      <Container
        ref={onMount}
        name={`cluster-${clusterId}`}
        x={x + delta.x}
        y={y + delta.y}
      >
        {showClusterStats && (
          <ClusterStats
            x={x}
            y={height / 2 + 10 / scale.y}
            cluster={cluster}
            clusterId={clusterId}
            scale={skale}
            onTryClick={onTryClick}
          />
        )}
        <Stars nodes={nodes} myPeerId={peerId} scale={scale} fill={fill} />
        <Edges edges={edges} scale={scale} fill={lineColor} />
        {showCompute && (
          <CustomPath path={computePath} scale={scale} animated lineWidth={5} />
        )}
        {showQuery && (
          <CustomPath
            animated
            fill={parseColor(datasets[query.dataset].color)}
            path={queryPath}
            scale={scale}
            lineWidth={5}
          />
        )}
        {!!earnPaths.length &&
          earnPaths.map(({ path, color }, i) => (
            <CustomPath
              key={`${path.map(({ id }) => id).join()}`}
              animated
              roundTrip
              fill={color}
              path={path}
              scale={scale}
              opacity={showQuery || showCompute ? 0.25 : 1}
              onAllLinesReversed={this.callFinished}
            />
          ))}
      </Container>
    )
  }
}

export default connect(
  state => ({
    activeWindow: state.windowPlacements.active,
    offset: state.drawing.parallax.offset,
  }),
  dispatch => ({
    logCall: (...args) => dispatch(logCall(...args)),
  }),
)(ClusterContainer)

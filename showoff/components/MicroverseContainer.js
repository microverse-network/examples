import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as PIXI from 'pixi.js'
import { Stage, Text, Container, Sprite } from 'react-pixi-fiber'

import ClusterContainer from './ClusterContainer'

// import Rectangle from './Rectangle'
// import Cluster from './Cluster'
// import Background from './Background'
// import background from '../assets/starfield.png'

import { clusterCoordinates } from '../redux/network'

import { MIN_ZOOM, MAX_ZOOM } from './App'

const BG_COUNT = 10

class MicroverseContainer extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    stageDidMount: PropTypes.func.isRequired,
    onPositionUpdate: PropTypes.func.isRequired,
    scale: PropTypes.object,
    peerId: PropTypes.string,
    network: PropTypes.object,
    onSelect: PropTypes.func,
    position: PropTypes.object,
    clusters: PropTypes.object,
    datasets: PropTypes.object,
    instances: PropTypes.object,
    initialized: PropTypes.bool,
    queriedPath: PropTypes.object,
    computedPath: PropTypes.object,
    query: PropTypes.object,
    compute: PropTypes.object,
    clusterCoordinates: PropTypes.array,
    onTryClick: PropTypes.func,
    shouldDraw: PropTypes.bool,
  }

  state = {
    loading: false,
    overlaps: [],
    clusterPositions: {},
  }

  componentDidMount() {
    this.dragStarted = false
    this.pixiClusterContainers = {}
  }

  getClusterPosition = clusterId => {
    return this.pixiClusterContainers[clusterId].getBounds()
  }

  checkIfOverCluster = (x, y, cancel) => {
    if (cancel) return this.setState({ overlaps: [] })

    const overlaps = Object.values(this.pixiClusterContainers).reduce(
      (overlaps, cluster) => {
        const bounds = cluster.getBounds()
        if (
          x >= bounds.x &&
          x < bounds.x + bounds.width &&
          y >= bounds.y &&
          y < bounds.y + bounds.height
        ) {
          const clusterId = cluster.name.replace('cluster-', '')
          overlaps.push(clusterId)
        }
        return overlaps
      },
      [],
    )
    this.setState({ overlaps })
    return overlaps
  }

  onAssetsLoaded = (loader, res) => {
    this.setState({ loading: false })
  }

  onMouseDown = (clusterId, e) => {
    if (e) {
      this.draggedCluster = clusterId
    } else {
      e = clusterId
    }
    const { position } = this.props
    this.dragStarted = true
    this.initialClientCoords = [e.clientX, e.clientY]
    this.initialPosition = { ...position }
  }

  onMouseUp = (clusterId, e) => {
    this.draggedCluster = null
    this.dragStarted = false
  }

  onMouseMove = (clusterId, e) => {
    if (!e) e = clusterId
    if (!this.dragStarted) return
    const { scale } = this.props
    const [x, y] = this.initialClientCoords
    let { clientX, clientY } = e
    if (e.data) {
      clientX = e.data.global.x
      clientY = e.data.global.y
    }
    const positionDelta = {
      x: clientX - x,
      y: clientY - y,
    }
    if (this.draggedCluster) {
      return this.setState({
        clusterPositions: {
          ...this.state.clusterPositions,
          [clusterId]: {
            x: positionDelta.x / scale.x,
            y: positionDelta.y / scale.y,
          },
        },
      })
    }
    this.props.onPositionUpdate(this.initialPosition, positionDelta)
  }

  registerContainer = clusterId => container => {
    this.pixiClusterContainers[clusterId] = container
  }

  putContainers() {
    const {
      scale,
      peerId,
      clusters,
      datasets,
      query,
      queriedPath,
      computedPath,
      clusterCoordinates,
      network,
      compute,
      onTryClick,
      shouldDraw,
    } = this.props

    return clusterCoordinates.map(({ clusterId, x, y, height }) => {
      const { graph, layout } = network[clusterId]

      return (
        <ClusterContainer
          key={clusterId}
          clusterId={clusterId}
          x={x}
          y={y}
          graph={graph}
          datasets={datasets}
          layout={layout}
          onMount={this.registerContainer(clusterId)}
          compute={compute}
          scale={scale}
          peerId={peerId}
          query={query}
          cluster={clusters[clusterId]}
          delta={this.state.clusterPositions[clusterId]}
          queriedPath={queriedPath[clusterId]}
          computedPath={computedPath[clusterId]}
          onTryClick={onTryClick}
          shouldDraw={shouldDraw}
        />
      )
    })
  }

  putLoading() {
    const { width, height } = this.props

    return (
      <Text
        x={width / 2}
        y={height / 2}
        anchor={[0.5, 0.5]}
        text="Loading…"
        style={{ fontSize: 28, fill: 0xffffff }}
      />
    )
  }

  putBackgrounds() {
    const background = 'DUMMY'
    const { width, height, scale } = this.props
    const scaleX = scale.x * 10
    const arr = new Array(BG_COUNT)
    const sizes = arr.fill(1).reduce(acc => {
      // acc.push([width, height])
      if (acc.length) {
        const last = acc[acc.length - 1]
        acc.push([last[0] * 1.01, last[1] * 1.01])
      } else {
        acc.push([width, height])
      }
      return acc
    }, [])
    const backgrounds = sizes.reverse().map((size, i) => {
      const zoomSpan = (MAX_ZOOM - MIN_ZOOM) * 10
      const len = BG_COUNT
      let fromScale, toScale, alpha

      alpha = 0
      fromScale = i === 0 ? MIN_ZOOM * 10 : (zoomSpan / len) * i
      toScale = i === len - 1 ? MAX_ZOOM * 10 : (zoomSpan / len) * (i + 1)
      const span = toScale - fromScale
      alpha = scaleX - fromScale / span

      return (
        <Sprite
          alpha={alpha}
          // fill={0xffffff}
          anchor={[0.5, 0.5]}
          key={`bg:${i}`}
          width={size[0]}
          height={size[1]}
          texture={PIXI.Texture.fromImage(background)}
        />
      )
    })
    return <Container>{backgrounds}</Container>
  }

  onDistribute = async (clusterIds, datasetSlug) => {
    // console.log(clusterIds, datasetSlug)
    const { datasets, instances, clusters } = this.props
    const dataset = datasets[datasetSlug]
    for (let i = clusterIds.length - 1; i >= 0; i--) {
      const clusterId = clusterIds[i]
      const peer = instances[clusters[clusterId].instanceId]
      await peer.db.get('datasets').insert(dataset)
    }
  }

  render() {
    const { width, height, scale, position, stageDidMount } = this.props

    const { loading } = this.state

    return (
      <Stage
        ref={c => c && stageDidMount(c._app.stage, c._app)}
        interactive
        name="stage"
        width={width}
        height={height}
        scale={scale}
        position={position}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
        options={{ antialias: true, transparent: true }}
      >
        {loading ? (
          this.putLoading()
        ) : (
          <Container name="microverse-container">
            {this.putContainers()}
          </Container>
        )}
      </Stage>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    query: state.query,
    compute: state.compute,
    network: state.network,
    clusters: state.microverse.clusters,
    datasets: state.distribute.datasets,
    instances: state.microverse.instances,
    clusterCoordinates: clusterCoordinates(state),
    shouldDraw: state.drawing.shouldDraw,
  }
}

export default connect(mapStateToProps)(MicroverseContainer)

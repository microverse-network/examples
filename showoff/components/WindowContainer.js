import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Fixed, Absolute } from 'rebass'

import {
  showWindow,
  closeWindow,
  closeAllWindows,
  getWindows,
} from '../redux/windows'
import { logCall } from '../redux/logs'
import { setActiveCompute, resetCompute } from '../redux/compute'
import { makeQuery, resetQuery } from '../redux/query'
import random from '../utils/random'

const WINDOW_WIDTH = 410

const COORDS = {
  primary: {
    left: index => 0,
    top: () => 0,
  },
  secondary: {
    right: index => WINDOW_WIDTH * index + 32,
    top: () => 0,
  },
}

const calculateProps = (index, placement) => {
  const base = COORDS[placement]

  return Object.keys(base).reduce((result, key) => {
    const fn = base[key]

    return {
      ...result,
      [key]: fn(index),
    }
  }, {})
}

export class WindowContainer extends Component {
  static propTypes = {
    width: PropTypes.number,
    nodes: PropTypes.object,
    windows: PropTypes.array,
    logCall: PropTypes.func,
    clusters: PropTypes.object,
    services: PropTypes.array,
    parallax: PropTypes.object,
    placement: PropTypes.oneOf(['primary', 'secondary']),
    instances: PropTypes.object,
    makeQuery: PropTypes.func,
    resetQuery: PropTypes.func,
    showWindow: PropTypes.func,
    onTryClick: PropTypes.func,
    closeWindow: PropTypes.func,
    resetCompute: PropTypes.func,
    closeAllWindows: PropTypes.func,
    setActiveCompute: PropTypes.func,
  }

  static defaultProps = {
    width: 410,
  }

  onClose = id => () => this.props.closeWindow(id)

  onExecute = (clusterId, service) => {
    const {
      setActiveCompute,
      resetCompute,
      showWindow,
      closeWindow,
      clusters,
      instances,
      logCall,
    } = this.props

    const from = instances[clusters[clusterId].instanceId]
    const tos = Object.values(this.props.nodes).filter(
      n => n.instanceId === from._id,
    )
    const to = tos[random(0, tos.length - 1)]
    closeWindow('DistributeResultWindow')
    closeWindow('ComputeResultWindow')
    resetCompute()
    const route = { from: from._id, to: to._id }
    setActiveCompute({
      ...route,
      data: {},
      type: 'service.request',
    })
    logCall({
      log: { ...route, color: 'white', userInitiated: true, type: 'call' },
      type: 'calls',
    })
    showWindow('ComputeResultWindow', 'secondary', {
      service,
      clusterId,
    })
  }

  onResetQuery = () => {
    const { closeWindow, resetQuery } = this.props

    closeWindow('DistributeResultWindow')
    resetQuery()
  }

  onQuery = (clusterId, dataset) => {
    const {
      showWindow,
      closeWindow,
      clusters,
      instances,
      nodes,
      makeQuery,
      resetQuery,
      logCall,
    } = this.props

    resetQuery()
    closeWindow('ComputeResultWindow')
    closeWindow('DistributeResultWindow')
    const from = instances[clusters[clusterId].instanceId]
    const tos = Object.values(nodes).filter(n => n.instanceId === from._id)
    const to = tos[random(0, tos.length - 1)]
    const route = { from: from._id, to: to._id }
    const { slug, color } = dataset
    makeQuery({
      ...route,
      dataset: slug,
      response: '',
    })
    logCall({
      log: { ...route, color, userInitiated: true, type: 'query' },
      type: 'calls',
    })

    showWindow('DistributeResultWindow', 'secondary', {
      name: dataset.name,
      slug: dataset.slug,
      clusterId,
    })
  }

  onTryClick = () => {
    const { showWindow, closeAllWindows, services, clusters } = this.props

    closeAllWindows('primary')
    showWindow('TryWindow', 'primary', {
      onExecute: this.onExecute,
      onReset: this.onResetQuery,
      onQuery: this.onQuery,
      services,
      clusters,
    })
  }

  render() {
    const { windows = [], placement, parallax } = this.props
    const Container = placement === 'primary' ? Fixed : Absolute
    const onTryClick = this.onTryClick

    return (
      <Container
        style={{
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: '100%',
        }}
        {...calculateProps(0, placement)}
      >
        {windows
          .filter(
            // only keep the side nav if width is small
            ({ id }) => (id === 'StoryWindow' ? true : window.innerWidth > 600),
          )
          .map(({ id, WindowComponent, props }, index) => (
            <WindowComponent
              key={id}
              {...{ ...props, onTryClick, parallax }}
              onClose={this.onClose(id)}
            />
          ))}
      </Container>
    )
  }
}

const mapStateToProps = (state, props) => ({
  windows: getWindows(state)(props.placement),
  placement: props.placement,
  nodes: state.microverse.nodes,
  clusters: state.microverse.clusters,
  services: state.compute.services,
  instances: state.microverse.instances,
})

const mapDispatchToProps = dispatch => ({
  logCall: (...args) => dispatch(logCall(...args)),
  makeQuery: (...args) => dispatch(makeQuery(...args)),
  resetQuery: (...args) => dispatch(resetQuery(...args)),
  showWindow: (...args) => dispatch(showWindow(...args)),
  closeWindow: id => dispatch(closeWindow(id)),
  resetCompute: (...args) => dispatch(resetCompute(...args)),
  closeAllWindows: (...args) => dispatch(closeAllWindows(...args)),
  setActiveCompute: (...args) => dispatch(setActiveCompute(...args)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WindowContainer)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import series from 'async/series'
import shortid from 'shortid'
import LocalNode from 'microverse-core/lib/localnode'
import addWheelListener from 'mouse-wheel'
import { Absolute, Box } from 'rebass'
import Hammer from 'hammerjs'

import { updateMCH } from '../redux/mch'
import { queryPath } from '../redux/query'
import { computePath } from '../redux/compute'
import { registerPeer } from '@microverse-network/redux'
import { initialize, setSlide } from '../redux/drawing'
import { addDistribution, removeDistribution } from '../redux/distribute'

import Hero from './Hero'
import InfoBar from './InfoBar'
import WhatIsThis from './WhatIsThis'
import WindowContainer from './WindowContainer'
import MicroverseContainer from './MicroverseContainer'
import DistributeManager from '../utils/DistributeManager'

export const MIN_ZOOM = 0.2
export const MAX_ZOOM = 100
export const PERSPECTIVE = 80
export const PUT_LOCAL_PEERS = true
export const PUT_BROWSER_PEER = !PUT_LOCAL_PEERS
export const NAV_LINKS = [
  { title: 'HOME', hash: '' },
  { title: 'PRODUCT', hash: 'product' },
  { title: 'DEPLOY', hash: 'deploy' },
  { title: 'TECHNOLOGY', hash: 'technology' },
  { title: 'REVENUE', hash: 'revenue' },
  { title: 'ROADMAP', hash: 'roadmap' },
  { title: 'JOIN', hash: 'join' },
  { title: 'TRY THE TESTNET', hash: 'try' },
]

const degToRad = deg => (deg * Math.PI) / 180

export class App extends Component {
  static propTypes = {
    mch: PropTypes.number.isRequired,
    peer: PropTypes.object.isRequired,
    nodes: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    parallax: PropTypes.object,
    services: PropTypes.array.isRequired,
    setSlide: PropTypes.func.isRequired,
    localPeer: PropTypes.object,
    updateMCH: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    shouldDraw: PropTypes.bool,
    initialized: PropTypes.bool,
    queriedPath: PropTypes.object.isRequired,
    registerPeer: PropTypes.func.isRequired,
    computedPath: PropTypes.object.isRequired,
    addDistribution: PropTypes.func.isRequired,
    windowPlacements: PropTypes.object.isRequired,
    removeDistribution: PropTypes.func.isRequired,
  }

  state = {
    peer: null,
    logs: [],
    graphicsCount: null,
    scale: { x: 1, y: 1 },
    position: { x: 0, y: 0 },
    width: window.innerWidth,
    height: window.innerHeight,
    bgRatio: 1,
    whatIsThis: false,
  }

  localPeers = []

  componentDidMount() {
    document.getElementById('fixed-bg').style.opacity = 1
    this.props.updateMCH()

    setInterval(() => {
      const { parallax, updateMCH } = this.props
      if (!parallax.offset) updateMCH()
    }, 5000)

    if (localStorage.noHero) setTimeout(this.init, 1000)
  }

  bindKeyNavigation() {
    document.addEventListener('keydown', event => {
      const isDown = ['ArrowDown', 'Space'].includes(event.key)
      const isUp = event.key === 'ArrowUp'

      if (isDown) return this.scroll(0, 1, 0, event)
      if (isUp) return this.scroll(0, -1, 0, event)
    })
  }

  scroll = (dx, dy, dz, event) => {
    if (event.ctrlKey || event.metaKey) return
    event.preventDefault()
    const { setSlide, parallax } = this.props
    const { offset, dirty } = parallax
    if (dirty) return
    const newOffset = dy > 0 ? Math.min(offset + 1, 6) : Math.max(offset - 1, 0)
    if (offset !== newOffset) setSlide(newOffset)
  }

  zoomCluster = (dx, dy, dz, event, factor) => {
    if (event.target && event.target.tagName !== 'CANVAS') return
    // if (!(event.ctrlKey || event.metaKey)) return
    event.preventDefault && event.preventDefault()
    if (!this._app) return
    const direction = dy < 0 ? 1 : -1
    // factor from pinch event
    factor = factor || 1 + direction * 0.25
    let { clientX, clientY } = event
    // polyfilling the lack of clientX/Y from pinch
    clientX = clientX || window.innerWidth / 2
    clientY = clientY || window.innerHeight / 2

    const ctx = {
      global: { x: clientX, y: clientY },
    }

    const scale = {
      x: Math.min(Math.max(this.state.scale.x * factor, MIN_ZOOM), MAX_ZOOM),
      y: Math.min(Math.max(this.state.scale.y * factor, MIN_ZOOM), MAX_ZOOM),
    }

    const before = this._app.stage.toLocal(ctx.global)

    this.setState({ scale }, () => {
      const after = this._app.stage.toLocal(ctx.global)
      const position = {
        x: this.state.position.x + (after.x - before.x) * scale.x,
        y: this.state.position.y + (after.y - before.y) * scale.y,
      }

      const absHeight = (1 + PERSPECTIVE) * 2 * Math.tan(degToRad(60))
      const absHeightCurr = (scale.y + PERSPECTIVE) * 2 * Math.tan(degToRad(60))
      const bgRatio = absHeightCurr / absHeight

      this.setState({ position, bgRatio })
    })
  }

  bindSwipeEvents() {
    const manager = new Hammer.Manager(document.body)
    const Swipe = new Hammer.Swipe()
    const Pinch = new Hammer.Pinch()
    manager.add([Swipe, Pinch])

    manager.on('swipe', e => {
      const isUp = e.offsetDirection === 16
      const isDown = e.offsetDirection === 8
      if (isUp) return this.scroll(0, -1, 0, event)
      if (isDown) return this.scroll(0, 1, 0, event)
    })
    manager.on('pinch', e => {
      if (!this.props.shouldDraw) return e.preventDefault()
      this.zoomCluster(0, 0, 0, e, e.scale > 1 ? 1.25 : 0.75)
    })
    // prevent dragging behavior on mobile
    // however it doesn't seem to do anything
    document.addEventListener('touchmove', e => e.preventDefault, false)
  }

  init = () => {
    const {
      peer,
      registerPeer,
      localPeer,
      addDistribution,
      removeDistribution,
      initialize,
    } = this.props

    this.bindSwipeEvents()
    this.bindKeyNavigation()
    addWheelListener(this.zoomCluster)
    // const debounceOptions = { leading: true, trailing: false }
    // addWheelListener(_.debounce(this.scroll, 200, debounceOptions))
    initialize()
    window.innerWidth <= 600 && this.zoomCluster(0, 0, 0, {}, 0.5)

    const hash = document.location.hash.replace('#', '')
    const links = NAV_LINKS.map(({ hash }) => hash)
    if (links.includes(hash)) {
      this.props.setSlide(links.indexOf(hash))
    }

    if (PUT_LOCAL_PEERS) {
      registerPeer(localPeer)
      const manager = new DistributeManager({ node: localPeer })
      manager.on('distribution.create', distribution => {
        addDistribution(distribution)
      })
      manager.on('distribution.remove', distribution => {
        removeDistribution(distribution)
      })
    }

    if (PUT_BROWSER_PEER) {
      registerPeer(peer)

      const manager1 = new DistributeManager({ node: peer })

      manager1.on('distribution.create', distribution => {
        addDistribution(distribution)
      })

      manager1.on('distribution.remove', distribution => {
        removeDistribution(distribution)
      })

      manager1.on('dataset.create', async dataset => {
        const query = { dataset: dataset.slug, node: peer._id }
        await peer.db
          .get('distributions')
          .update(query, query, { upsert: true })
      })
    }

    window.addEventListener('resize', e => {
      this.setState({ width: window.innerWidth, height: window.innerHeight })
    })
  }

  onPositionUpdate = (initalPosition, positionDelta) => {
    const newPosition = {
      x: initalPosition.x + positionDelta.x,
      y: initalPosition.y + positionDelta.y,
    }
    this.setState({ position: newPosition })
  }

  stageDidMount = (stage, app) => {
    this._app = app
  }

  createLocalNode(options = {}) {
    const peer = new LocalNode({ id: shortid.generate() })

    const manager = new DistributeManager({ node: peer })

    manager.on('dataset.create', async dataset => {
      const query = { dataset: dataset.slug, node: peer._id }
      await peer.db.get('distributions').update(query, query, { upsert: true })
    })

    this.localPeers.push(peer)
    return peer
  }

  onAddNodes = () => {
    const tasks = []
    for (let i = 0; i < 20; i++) {
      tasks.push(callback => {
        setTimeout(() => {
          callback(null, this.createLocalNode({ id: shortid.generate() }))
        }, 100)
      })
    }

    series(tasks)
  }

  onWhatIsThis = () => {
    this.setState({ whatIsThis: !this.state.whatIsThis })
  }

  render() {
    const {
      mch,
      peer,
      nodes,
      computedPath,
      services,
      queriedPath,
      windowPlacements,
      shouldDraw,
      initialized,
    } = this.props
    const { active: activeWindow } = windowPlacements

    const { width, height, position, scale, bgRatio, whatIsThis } = this.state
    const { noHero } = localStorage

    return (
      <Box>
        {!noHero && <Hero init={this.init} initialized={initialized} />}
        {!peer.id.startsWith('bot') ? (
          <Absolute
            top={0}
            left={0}
            right={0}
            style={{
              opacity: initialized ? 1 : 0,
              transition: 'opacity 2.5s ease',
            }}
          >
            <MicroverseContainer
              peer={peer}
              peerId={peer._id}
              width={width}
              height={height}
              scale={scale}
              bgRatio={bgRatio}
              position={position}
              initialized={initialized}
              queriedPath={queriedPath}
              computedPath={computedPath}
              stageDidMount={this.stageDidMount}
              onPositionUpdate={this.onPositionUpdate}
              onTryClick={this.onTryClick}
            />
          </Absolute>
        ) : null}

        {initialized && <WindowContainer placement="secondary" />}

        <Absolute
          left="50%"
          bottom={8}
          style={{ zIndex: 1, transform: 'translateX(-50%)' }}
        >
          <InfoBar
            mchs={mch}
            peer={peer}
            baseCount={this.state.graphicsCount}
            nodes={nodes}
            services={services}
            initialized={initialized}
            onWhatIsThis={this.onWhatIsThis}
            activeWindow={activeWindow}
            shouldDraw={shouldDraw}
          />
        </Absolute>
        {whatIsThis ? <WhatIsThis cancel={this.onWhatIsThis} /> : ''}
      </Box>
    )
  }
}

export default connect(
  state => ({
    mch: state.mch.distributed,
    nodes: state.microverse.nodes,
    parallax: state.drawing.parallax,
    services: state.compute.services,
    shouldDraw: state.drawing.shouldDraw,
    initialized: state.drawing.initialized,
    queriedPath: queryPath(state),
    computedPath: computePath(state),
    windowPlacements: state.windowPlacements,
  }),
  dispatch => ({
    setSlide: (...args) => dispatch(setSlide(...args)),
    updateMCH: (...args) => dispatch(updateMCH(...args)),
    initialize: (...args) => dispatch(initialize(...args)),
    registerPeer: (...args) => dispatch(registerPeer(...args)),
    addDistribution: (...args) => dispatch(addDistribution(...args)),
    removeDistribution: (...args) => dispatch(removeDistribution(...args)),
  }),
)(App)

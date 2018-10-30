import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'react-tippy'
import numeral from 'numeral'
import { Spring } from 'react-spring'

import Card from './Card'
import { TopLabel, Title1, TopLabelWrapper, TooltipInner, Strip } from './Boxes'

const MCH_TO_USD = 14.32
const NODE_MULTIPLIER = 299

export default class InfoBar extends Component {
  static propTypes = {
    baseCount: PropTypes.number,
    peer: PropTypes.object,
    mchs: PropTypes.number,
    nodes: PropTypes.object,
    services: PropTypes.array,
    initialized: PropTypes.bool.isRequired,
    activeWindow: PropTypes.string,
    shouldDraw: PropTypes.bool,
  }

  state = {
    workers: 0,
    nodeCount: 0,
    serviceCount: 0,
    mchCount: 0,
    fire: false,
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fire: true })
    }, 2000)
  }

  render() {
    const { initialized, activeWindow, services, nodes, mchs } = this.props
    const { fire } = this.state
    const shorten = window.innerWidth < 800
    const isVisible = initialized && activeWindow !== 'TryWindow'
    const nodeCount = Object.keys(nodes).length * NODE_MULTIPLIER
    const serviceCount = (services.length * NODE_MULTIPLIER) / 10
    const mchCount = mchs * NODE_MULTIPLIER
    const mchInUsd = mchCount * MCH_TO_USD
    const payout =
      mchInUsd / nodeCount / 12 >= Infinity ? 0 : mchInUsd / nodeCount / 12
    return (
      <Card className={isVisible ? 'in' : ''}>
        <Spring
          from={{
            payout: 0,
            mchCount: 0,
            mchInUsd: 0,
            nodeCount: 0,
            serviceCount: 0,
          }}
          to={{
            payout: isVisible && fire ? payout : 0,
            mchCount: isVisible && fire ? mchCount : 0,
            mchInUsd: isVisible && fire ? mchInUsd : 0,
            nodeCount: isVisible && fire ? nodeCount : 0,
            serviceCount: isVisible && fire ? serviceCount : 0,
          }}
          isVisible={isVisible}
          shorten={shorten}
        >
          {props => <Counts {...props} />}
        </Spring>
        <Title1>SIMULATED MAIN NETWORK STATS</Title1>
      </Card>
    )
  }
}

const Counts = props => {
  const {
    isVisible,
    nodeCount,
    serviceCount,
    mchCount,
    mchInUsd,
    payout,
    shorten,
  } = props

  return (
    <Strip>
      <TopLabelWrapper>
        <TopLabel>Nodes: </TopLabel>
        <Tooltip
          disabled={!isVisible}
          theme="light"
          position="bottom"
          html={
            <TooltipInner style={{ textShadow: 'none' }}>
              Amount of nodes that are currently online. All those nodes are
              ready to respond to compute requests or store data. A node can be
              a browser, backend server, or an IoT device. You can click on each
              of them on the map to see what they are.
            </TooltipInner>
          }
        >
          {numeral(nodeCount).format('0,0')}
        </Tooltip>
      </TopLabelWrapper>
      <TopLabelWrapper>
        <Tooltip
          disabled={!isVisible}
          theme="light"
          position="bottom"
          html={
            <TooltipInner style={{ textShadow: 'none' }}>
              Amount of deployed services/apps in the Microverse.
            </TooltipInner>
          }
        >
          <TopLabel>Services: </TopLabel>
          {numeral(serviceCount).format('0,0')}
        </Tooltip>
      </TopLabelWrapper>
      <TopLabelWrapper>
        <Tooltip
          disabled={!isVisible}
          theme="light"
          position="bottom"
          html={
            <TooltipInner style={{ textShadow: 'none' }}>
              Approximate per user earnings in USD.
            </TooltipInner>
          }
        >
          <TopLabel>Payout: </TopLabel>
          {numeral(payout).format('$0,0.00')}
        </Tooltip>
      </TopLabelWrapper>
      <TopLabelWrapper>
        <Tooltip
          disabled={!isVisible}
          theme="light"
          position="bottom"
          html={
            <TooltipInner style={{ textShadow: 'none' }}>
              Total amount of distributed Microverse Coin for the services
              provided by the online nodes in the network to the owners of those
              nodes.
            </TooltipInner>
          }
        >
          <TopLabel>Distributed MCH: </TopLabel>
          {numeral(mchCount).format('0,0.00')}
        </Tooltip>
      </TopLabelWrapper>
      <TopLabelWrapper>
        <Tooltip
          disabled={!isVisible}
          theme="light"
          position="bottom"
          html={
            <TooltipInner style={{ textShadow: 'none' }}>
              Approximate USD value of the total amount of distributed
              Microverse Coin.
            </TooltipInner>
          }
        >
          <TopLabel>Distributed MCH in $: </TopLabel>
          {numeral(mchInUsd).format('$0,0')}
        </Tooltip>
      </TopLabelWrapper>
    </Strip>
  )
}

Counts.propTypes = {
  isVisible: PropTypes.bool,
  nodeCount: PropTypes.number,
  serviceCount: PropTypes.number,
  mchCount: PropTypes.number,
  mchInUsd: PropTypes.number,
  payout: PropTypes.number,
  shorten: PropTypes.bool,
}

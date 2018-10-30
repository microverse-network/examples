import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text, Divider } from 'rebass'

import { computePath } from '../redux/compute'

import GameWindow from './GameWindow'
import ResultWindowLogs from './ResultWindowLogs'
import { Heading, Paragraph, LogBox, LineNr, Code } from './Boxes'

export class ComputeResultWindow extends Component {
  static propTypes = {
    computedPath: PropTypes.object,
    onClose: PropTypes.func,
    service: PropTypes.object,
    nodes: PropTypes.object,
    right: PropTypes.number,
    bottom: PropTypes.number,
    clusterId: PropTypes.string,
  }

  static defaultProps = {
    right: 10,
    bottom: 110,
    logs: [],
    service: { name: 'currentTime' },
  }

  state = { result: null }

  componentDidMount() {
    const { fn, args } = this.props.service
    this.compute(fn, args)
  }

  componentDidUpdate(prevProps) {
    const { service, computedPath, clusterId } = prevProps
    const { fn, args } = this.props.service
    if (this.props.service.name !== service.name) return this.compute(fn, args)

    const oldPath = computedPath[clusterId]
      ? computedPath[clusterId].map(({ id }) => id).join()
      : ''
    const newPath = this.props.computedPath[this.props.clusterId]
      ? this.props.computedPath[this.props.clusterId].map(({ id }) => id).join()
      : ''

    if (newPath !== oldPath) return this.compute(fn, args)
  }

  compute(fn, args) {
    this.setState({ result: null })
    fn(...args).then(result => this.setState({ result }))
  }

  render() {
    const {
      right,
      bottom,
      onClose,
      service,
      computedPath,
      clusterId,
      nodes,
    } = this.props
    const logs = computedPath[clusterId]
      ? computedPath[clusterId].map((node, i) => node.id)
      : []

    const path = computedPath[clusterId] || []
    const platforms = path.map(node => nodes[node.id].runtimeInfo.name)

    const { explanation, name } = service
    const { result } = this.state

    return (
      <GameWindow
        onClose={onClose}
        bottom={bottom}
        right={right}
        className="in"
      >
        <Heading fontSize={2} my={3}>{`What's happening?`}</Heading>
        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        {explanation ? (
          <Text fontSize={1}>{explanation}</Text>
        ) : (
          <div>
            <Paragraph fontSize={1} my={3}>
              You have just run <Code p={1}>{name}</Code> in the microverse
              network.
            </Paragraph>
            <Paragraph>
              After the request has been received by the network, it is
              forwarded to a node which has {name} deployed.
            </Paragraph>
            <Paragraph>
              And the response is carried back to you through these nodes.
            </Paragraph>
          </div>
        )}
        <LogBox>
          <ResultWindowLogs logs={logs} platforms={platforms} />
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          {result ? (
            <Text color="#f77d7b" fontSize={2}>
              <LineNr>Result:</LineNr> {result}
            </Text>
          ) : (
            <LineNr>waiting for the result...</LineNr>
          )}
        </LogBox>
      </GameWindow>
    )
  }
}

export default connect(state => ({
  nodes: state.microverse.nodes,
  computedPath: computePath(state),
}))(ComputeResultWindow)

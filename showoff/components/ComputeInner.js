import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Relative, Divider } from 'rebass'

import { Heading, Selector, Pill, Paragraph, Title } from './Boxes'
import { ActionButton } from './GradientButton'

export default class ComputeInner extends Component {
  static propTypes = {
    clusters: PropTypes.object,
    services: PropTypes.array,
    onExecute: PropTypes.func,
    noTitle: PropTypes.bool,
  }

  static defaultProps = {
    noTitle: false,
  }

  render() {
    const { services, onExecute, clusters, noTitle } = this.props

    return (
      <Box>
        {!noTitle && (
          <Heading my={3} fontSize={1}>
            Deployed Microservices
          </Heading>
        )}

        {!noTitle && (
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        )}
        <Relative>
          <Paragraph>
            These are the microservices used in this test app which are deployed
            to a microverse network.
          </Paragraph>
          <Paragraph>
            You can run them to see a demonstration of how computation and
            messaging work in a microverse network.
          </Paragraph>
          <div>
            {services.length &&
              services.map((service, i) => (
                <ServiceItem
                  last={i === services.length - 1}
                  onExecute={onExecute}
                  key={service.name}
                  service={service}
                  clusters={clusters}
                />
              ))}
          </div>
        </Relative>
      </Box>
    )
  }
}

class ServiceItem extends Component {
  static propTypes = {
    clusters: PropTypes.object,
    service: PropTypes.object,
    onExecute: PropTypes.func,
    expanded: PropTypes.bool,
    last: PropTypes.bool,
  }

  state = { records: [], selectedCluster: '' }

  graphics = {}

  componentDidMount() {
    const { clusters } = this.props
    this.setState({ selectedCluster: Object.keys(clusters)[0] })
  }

  componentDidUpdate(prevProps) {
    const { clusters: nextClusters } = prevProps
    const { clusters } = this.props
    if (
      Object.keys(clusters).length === Object.keys(nextClusters).length &&
      this.state.selectedCluster
    ) {
      return
    }
    this.setState({ selectedCluster: Object.keys(clusters)[0] })
  }

  onSelectChange = event => {
    this.setState({ selectedCluster: event.target.value })
  }

  execute = () => {
    const { service } = this.props
    const { selectedCluster } = this.state
    this.props.onExecute(selectedCluster, service)
  }

  render() {
    const { service, last, clusters } = this.props
    const { records, selectedCluster } = this.state

    const clusterIds = Object.keys(clusters)

    return (
      <Flex justifyContent="flex-start" alignItems="center">
        <Pill />
        <Title style={last ? { borderBottom: 'none' } : {}}>
          {service.name} {records.length || ''}
        </Title>
        {clusterIds.length > 1 && (
          <Selector onChange={this.onSelectChange} value={selectedCluster}>
            <option>Select a cluster</option>
            {clusterIds.map(id => (
              <option key={id} value={id}>
                {clusters[id].niceName}
              </option>
            ))}
          </Selector>
        )}
        <ActionButton bg="#111" style={{ fontSize: 12 }} onClick={this.execute}>
          Run
        </ActionButton>
      </Flex>
    )
  }
}

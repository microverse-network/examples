import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Relative, Select, Divider } from 'rebass'
import { connect } from 'react-redux'

import { ActionButton } from './GradientButton'
import { Heading, Paragraph, Pill } from './Boxes'

export class DistributeData extends Component {
  static propTypes = {
    onDistribute: PropTypes.func,
    onReset: PropTypes.func,
    data: PropTypes.array,
    clusters: PropTypes.object,
  }

  static defaultProps = {
    onReset: () => {},
  }

  state = {
    selectedCluster: '',
  }

  componentWillReceiveProps(nextProps) {
    const { clusters } = nextProps
    if (
      !clusters.length &&
      clusters.length === this.props.clusters.length &&
      this.state.selectedCluster
    ) {
      return
    }

    this.setState({ selectedCluster: Object.keys(clusters)[0] })
  }

  onDistribute = dataset => () =>
    this.props.onDistribute(this.state.selectedCluster, dataset)

  onReset = dataset => () => this.props.onReset(dataset)

  onSelectChange = event => {
    this.setState({ selectedCluster: event.target.value })
  }

  renderRow = dataset => {
    const { name, storage, color, isUsed } = dataset
    const onClick = isUsed ? this.onReset(dataset) : this.onDistribute(dataset)

    return (
      <tr key={name}>
        <td>
          <Pill
            style={{
              backgroundColor: color,
              display: 'block',
              flex: 'none',
              margin: '0 6px 0 0',
            }}
          />
        </td>
        <td>{name}</td>
        <td style={{ fontSize: '0.75rem' }}>{storage}</td>
        <td className="text-center">
          <ActionButton onClick={onClick} style={{ width: '100%' }}>
            {isUsed ? 'Reset' : 'Query'}
          </ActionButton>
        </td>
        <td>
          <div style={{ height: '28px' }} />
        </td>
      </tr>
    )
  }

  render() {
    const { data, clusters } = this.props

    const style = { fontSize: '1rem' }

    return (
      <Box>
        <Heading my={3} fontSize={1}>
          Query Data
        </Heading>
        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <Relative>
          <Paragraph>
            You can store and query data from microverse&apos;s mongo-like p2p
            database. It&apos;s a sharded database. The data is randomly
            distributed to the nodes in small pieces.
          </Paragraph>
          <Paragraph>
            We preloaded these datasets below to this test network. You can try
            and see how the network responds.
          </Paragraph>
          <div className="table-responsive">
            <table
              className="table table-lightborder"
              style={style}
              width="100%"
            >
              <thead>
                {Object.keys(clusters).length > 1 ? (
                  <tr>
                    <td colSpan={3}>Select a cluster:</td>
                    <td className="text-center">
                      <Select
                        onChange={this.onSelectChange}
                        value={this.state.selectedCluster}
                        style={{
                          flex: '0 1 auto',
                          backgroundColor: '#00000044',
                          boxShadow: 'none',
                          border: '1px solid #ffffff22',
                          borderColor:
                            '#ffffff22 #ffffff33 #ffffff33 #ffffff22',
                          borderRadius: 0,
                          fontWeight: 500,
                          fontFamily: 'var(--font-family-sans-serif)',
                          textAlignLast: 'center',
                        }}
                      >
                        {Object.keys(clusters).map(clusterId => (
                          <option key={clusterId} value={clusterId}>
                            {clusters[clusterId].niceName}
                          </option>
                        ))}
                      </Select>
                    </td>
                  </tr>
                ) : (
                  <tr />
                )}
              </thead>
              <tbody>{data.map(this.renderRow)}</tbody>
            </table>
          </div>
        </Relative>
      </Box>
    )
  }
}

export default connect(state => ({
  data: Object.values(state.distribute.datasets),
}))(DistributeData)

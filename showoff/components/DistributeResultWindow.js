import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { tomorrow } from 'react-syntax-highlighter/styles/prism'
import { Box, Text, Divider } from 'rebass'

import { queryPath } from '../redux/query'

import GameWindow from './GameWindow'
import ResultWindowLogs from './ResultWindowLogs'
import { Heading, Paragraph, LogBox, LineNr, Code } from './Boxes'

export class DistributeResultWindow extends Component {
  static propTypes = {
    queriedPath: PropTypes.object,
    response: PropTypes.object,
    onClose: PropTypes.func,
    name: PropTypes.string,
    slug: PropTypes.string,
    right: PropTypes.number,
    bottom: PropTypes.number,
    clusterId: PropTypes.string,
    query: PropTypes.string,
    nodes: PropTypes.object,
  }

  static defaultProps = {
    right: 10,
    bottom: 110,
    logs: [],
  }

  state = { result: null }

  componentDidMount() {
    const { response } = this.props
    this.setResult(response)
  }

  componentDidUpdate(prevProps) {
    const { slug, queriedPath, clusterId } = prevProps

    if (this.props.slug !== slug) {
      return this.setResult(this.props.response)
    }

    const oldPath = queriedPath[clusterId]
      ? queriedPath[clusterId].map(({ id }) => id).join()
      : ''
    const newPath = this.props.queriedPath[this.props.clusterId]
      ? this.props.queriedPath[this.props.clusterId].map(({ id }) => id).join()
      : ''

    if (newPath !== oldPath) return this.setResult(this.props.response)
  }

  setResult(result) {
    this.setState({ result })
  }

  render() {
    const {
      bottom,
      right,
      onClose,
      name,
      slug,
      queriedPath,
      clusterId,
      query,
      nodes,
    } = this.props
    const logs = queriedPath[clusterId]
      ? queriedPath[clusterId].map((node, i) => node.id)
      : []
    const path = queriedPath[clusterId] || []
    const platforms = path.map(node => nodes[node.id].runtimeInfo.name)

    const { result } = this.state

    return (
      <GameWindow
        onClose={onClose}
        bottom={bottom}
        right={right}
        className="in"
      >
        <Box>
          <Heading fontSize={1} my={3}>
            What&apos;s happening?
          </Heading>
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <Paragraph fontSize={1} my={3}>
            You have just performed a sample database query in{' '}
            <Code p={1}>{name}</Code>.
          </Paragraph>
          <Paragraph>
            The request has been received by the microverse network and
            forwarded to an available node which has the {slug} data for a
            response.
          </Paragraph>
          <Paragraph>
            And the response is carried back to you through these nodes.
          </Paragraph>
          <LogBox>
            {logs.length ? (
              <div>
                <LineNr>Query:</LineNr>
                <SyntaxHighlighter
                  language="javascript"
                  style={tomorrow}
                  customStyle={{
                    background: 'transparent',
                    margin: 0,
                    padding: 0,
                    fontSize: '0.875rem',
                  }}
                >
                  {query}
                </SyntaxHighlighter>
                <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <ResultWindowLogs logs={logs} platforms={platforms} />
                <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                {result ? (
                  <table>
                    <tbody>
                      <tr>
                        <td
                          style={{ paddingRight: '0.5rem', textAlign: 'right' }}
                        >
                          <LineNr>Result:</LineNr>
                        </td>
                        <td />
                      </tr>
                      {Object.keys(result).map(key => (
                        <tr key={key}>
                          <td
                            style={{
                              paddingRight: '0.5rem',
                              textAlign: 'right',
                            }}
                          >
                            <LineNr>{key}:</LineNr>
                          </td>
                          <td>
                            <Text color="#f77d7b">{result[key]}</Text>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <LineNr>waiting for the result...</LineNr>
                )}
              </div>
            ) : (
              <Text color="white" fontSize={0}>
                There is no active peer in the cluster.
              </Text>
            )}
          </LogBox>
        </Box>
      </GameWindow>
    )
  }
}

export default connect((state, { slug }) => ({
  nodes: state.microverse.nodes,
  response: state.query.response,
  queriedPath: queryPath(state),
  query: state.distribute.datasets[slug].query,
}))(DistributeResultWindow)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import numeral from 'numeral'
import styled from 'styled-components'
import { Text, Divider, Code } from 'rebass'
import GameWindow from './GameWindow'
import { Heading, LogBox, LineNr, NodeLogos } from './Boxes'

const Col = styled.td`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
`

const Column = Col.extend`
  padding: 0 16px 0 8px;
`

const Gas = Code.extend`
  font-family: var(--font-family-monospace);
  font-size: 12px;
`

const Address = Text.extend`
  font-weight: 800;
  display: inline;
`

class CallLogWindow extends Component {
  static propTypes = {
    logs: PropTypes.array,
    count: PropTypes.number,
    onClose: PropTypes.func,
    name: PropTypes.string,
    right: PropTypes.number,
    bottom: PropTypes.number,
  }

  static defaultProps = {
    right: 10,
    bottom: 110,
    logs: [],
  }

  state = {
    show: false,
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({ show: true })
      this.timer = null
    }, 2000)
  }

  componentWillUnmount() {
    if (!this.timer) return
    clearTimeout(this.timer)
    this.timer = null
  }

  render() {
    const { bottom, right, logs, count, onClose } = this.props
    const { show } = this.state

    return (
      <GameWindow
        delayed={2500}
        onClose={onClose}
        bottom={bottom}
        right={right}
        className={show ? 'in' : ''}
      >
        <Heading fontSize={1} my={3}>
          Realtime Microservice Calls (AWS Lambda equivalent)
        </Heading>
        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        {logs.length ? (
          <LogBox>
            <table>
              <thead>
                <tr>
                  <Col />
                  <Column>
                    <LineNr>Location</LineNr>
                  </Column>
                  <Column>
                    <LineNr>Cost</LineNr>
                  </Column>
                  <Col>
                    <LineNr>Description</LineNr>
                  </Col>
                  <Column>
                    <LineNr>Platform</LineNr>
                  </Column>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const NodeLogo = NodeLogos[log.platform]
                  const your = log.userInitiated ? '👉 your ' : ''
                  const description =
                    log.type === 'call'
                      ? `${your}function call`
                      : `${your}data query`
                  return (
                    <tr
                      key={i}
                      style={{
                        color: log.color,
                        fontSize: 12,
                      }}
                    >
                      <Col>
                        <LineNr>{count > 5 ? count - 5 + i : i + 1}:</LineNr>
                      </Col>
                      <Column>
                        <Address>{log.location}</Address>
                      </Column>
                      <Column>
                        <Gas>{numeral(log.gas).format('0,0.000')} µMCH</Gas>
                      </Column>
                      <Col>{description}</Col>
                      <Column style={{ textAlign: 'center' }}>
                        <NodeLogo />
                      </Column>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </LogBox>
        ) : (
          <Text color="white" fontSize={0}>
            Waiting for the first call…
          </Text>
        )}
      </GameWindow>
    )
  }
}

export default connect(state => ({
  logs: state.logs.calls,
  count: state.logs.counts.calls,
}))(CallLogWindow)

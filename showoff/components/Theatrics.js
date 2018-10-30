import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Transition, config } from 'react-spring'

import { Absolute, Box } from 'rebass'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const Line = Box.extend`
  font-size: 24px;
  text-align: center;
  letter-spacing: 8px;
`
const Container = Absolute.extend`
  display: flex;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`
const TAG_LINES = [
  { key: 1, text: 'creating testnet' },
  { key: 2, text: 'locating peers' },
  { key: 3, text: 'initiating network graph' },
]

export default class Theatrics extends Component {
  static propTypes = {
    initialized: PropTypes.bool.isRequired,
    finish: PropTypes.func.isRequired,
  }

  state = {
    lines: [],
  }

  async componentDidMount() {
    for (let i = 0; i < TAG_LINES.length; i++) {
      const tagLine = TAG_LINES[i]
      const lines = [tagLine]
      this.setState({ lines })
      await sleep(1500)
    }
    this.setState({ lines: [] })
    await sleep(500)
    this.props.finish()
  }

  render() {
    const { lines } = this.state

    return (
      <Container>
        <Transition
          keys={lines.map(item => item.key)}
          from={{ opacity: 0, height: 0 }}
          enter={{ opacity: 1, height: 64 }}
          leave={{ opacity: 0, height: 0 }}
          config={config.slow}
        >
          {lines.map(item => styles => <Line style={styles}>{item.text}</Line>)}
        </Transition>
      </Container>
    )
  }
}

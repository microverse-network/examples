import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GameWindow from './GameWindow'
import { Box, Relative, Divider } from 'rebass'

import { Heading, Paragraph } from './Boxes'
import { ActionButton } from './GradientButton'

export default class EarnWindow extends Component {
  static propTypes = {
    left: PropTypes.number,
    bottom: PropTypes.number,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    left: 10,
    bottom: 110,
  }

  render() {
    const { left, bottom, onClose } = this.props

    return (
      <GameWindow left={left} bottom={bottom} onClose={onClose}>
        <Box>
          <Heading my={3} fontSize={1}>
            Earn Money
          </Heading>
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <Relative>
            <Paragraph>
              If you download microverse&apos;s cli tool or soon to be announced
              chrome extension, you can join the microverse network. This allows
              your resources to respond to the function calls or help relaying
              p2p messages.
            </Paragraph>
            <Paragraph>
              In both cases, microverse&apos;s ledger keeps track of every
              action and make payouts to the owners of those nodes in the
              network.
            </Paragraph>
            <Paragraph>Payout schedule TBDL.</Paragraph>
            <Heading my={3} fontSize={1}>
              Download
            </Heading>
            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <ActionButton
              bg="#111"
              style={{ fontSize: 12 }}
              onClick={this.execute}
              mr={2}
              href="https://www.npmjs.com/package/microverse-core"
            >
              Install Microverse
            </ActionButton>
            <ActionButton
              bg="#111"
              style={{ fontSize: 12 }}
              onClick={this.execute}
              href="https://chrome.google.com/webstore/category/extensions"
            >
              Get the Chrome Extension
            </ActionButton>
          </Relative>
        </Box>
      </GameWindow>
    )
  }
}

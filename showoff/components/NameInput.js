import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Flex, Box, Input, Button } from 'rebass'

export default class NameInput extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  }

  state = { value: '' }

  onChange = event => {
    this.setState({ value: event.target.value })
  }

  onSubmit = event => {
    event.preventDefault()
    this.props.onSubmit({ value: this.state.value })
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <Flex {...this.props}>
          <Box width={1}>
            <Input
              id="peer-name"
              px={2}
              placeholder="Enter your name and join the network"
              fontSize={3}
              value={this.state.value}
              onChange={this.onChange}
            />
          </Box>
          <Box ml={2}>
            <Button id="join" onClick={this.onSubmit} fontSize={3}>
              Join
            </Button>
          </Box>
        </Flex>
      </form>
    )
  }
}

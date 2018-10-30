import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Absolute, Close } from 'rebass'

import Card from './Card'

export default class GameWindow extends Component {
  static propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func,
    cardProps: PropTypes.object,
    width: PropTypes.any,
    delayed: PropTypes.number,
    noClose: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    delayed: 0,
    noClose: false,
    width: 410,
  }

  state = {
    showCloseButton: true,
  }

  componentDidMount() {
    const { delayed } = this.props
    if (delayed) {
      this.setState({ showCloseButton: false })
      this.timer = setTimeout(() => {
        this.setState({ showCloseButton: true })
        this.timer = null
      }, delayed)
    }
  }

  componentWillUnmount() {
    if (!this.timer) return
    clearTimeout(this.timer)
    this.timer = null
  }

  render() {
    const { children, onClose, noClose, width, className, style } = this.props
    const { showCloseButton } = this.state
    const shouldClose = !noClose && showCloseButton
    return (
      <Card
        className={className}
        style={{
          position: 'relative',
          padding: '1rem',
          width,
          ...style,
        }}
      >
        {shouldClose && (
          <Absolute right={11} top={23} zIndex={5}>
            <Close onClick={onClose} style={{ cursor: 'pointer' }} />
          </Absolute>
        )}
        {children}
      </Card>
    )
  }
}

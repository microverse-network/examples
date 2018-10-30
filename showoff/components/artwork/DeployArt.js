import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Stage, Text } from 'react-pixi-fiber'

import Interlace from './Interlace'
import random from '../../utils/random'

const TEXT_STYLE = {
  dropShadow: true,
  dropShadowBlur: 15,
  dropShadowAlpha: 0.4,
  dropShadowAngle: Math.PI / 2,
  dropShadowDistance: 0,
  dropShadowColor: 0x00ff00,
  fontSize: 48,
  fill: 0x00ff00,
  fontFamily: [
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ],
}

class DeployArt extends Component {
  static propTypes = {
    shouldDraw: PropTypes.bool,
  }

  state = {
    text: ' > ',
    mask: null,
  }

  componentDidUpdate({ shouldDraw }) {
    if (!shouldDraw && this.props.shouldDraw) this.init()
    if (shouldDraw && !this.props.shouldDraw) {
      clearTimeout(this.timer)
      this.setState({ text: ' > ' })
    }
  }

  init() {
    const fullText = 'micro deploy'
    let index = 0
    let text
    const next = ts => {
      let delay = 400
      let text_
      if (fullText.length >= index) {
        text = ' > ' + fullText.slice(0, index)
        delay = random(75, 200)
        text_ = `${text}|`
      } else {
        text_ = index % 2 ? text : `${text}|`
      }
      this.setState({ text: text_ })
      this.timer = setTimeout(next.bind(this), delay)
      index++
    }
    next()
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  setMask = mask => {
    this.setState({ mask })
  }

  render() {
    const { text, mask } = this.state
    const width = Math.min(450, window.innerWidth * 0.8)
    const fontSize = (48 * width) / 450
    return (
      <Stage
        width={width}
        height={width / 7.5}
        options={{ transparent: true, antialias: window.innerWidth <= 600 }}
      >
        <Text text={text} style={{ ...TEXT_STYLE, fontSize, fill: 0x043f05 }} />
        <Text mask={mask} text={text} style={{ ...TEXT_STYLE, fontSize }} />
        <Interlace
          width={450}
          height={60}
          name="deploy-art-mask"
          ref={this.setMask}
          steps={3}
          lineStyles={[1, 0xffffff, 1]}
        />
      </Stage>
    )
  }
}

export default connect((state, { slug }) => ({
  shouldDraw:
    state.drawing.parallax.offset === 2 && !state.drawing.parallax.dirty,
}))(DeployArt)

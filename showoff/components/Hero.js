import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Box, Absolute, Text } from 'rebass'
import { Spring } from 'react-spring'
import media from '../utils/media'

import { H1, H2 } from './Boxes'
import Logo from './Logo'
import { ButtonHero } from './GradientButton'
import Theatrics from './Theatrics'

const Wrapper = Absolute.extend`
  top: ${({ top }) => top};
  left: 50%;
  transform: ${({ translate }) => `translate(-50%, -${translate}%)`};
  min-width: ${({ mw }) => mw};
  text-align: center;
  z-index: 5;

  ${media.tablet`
    min-width: 90%;
  `};
`

const PasswordInput = Input.extend`
  display: block;
  margin: 0 auto 2rem;
  width: 200px;
  text-align: center;
  border: 1px solid #ffffff66;
  border-radius: 0;
  font-size: 1rem;
  letter-spacing: 0.125rem;
  box-shadow: none;
  padding: 5px 0;

  &.error {
    border-color: #f77d7b;
  }
  &.error:focus {
    box-shadow: inset 0 0 0 1px #f77d7b;
  }
`

class Content extends Component {
  static propTypes = {
    top: PropTypes.number,
    opacity: PropTypes.number,
    translate: PropTypes.number,
    logoHeight: PropTypes.number,
    logoMargin: PropTypes.number,
    h1Spacing: PropTypes.number,
    h2Spacing: PropTypes.number,
    h1FontSize: PropTypes.number,
    h2FontSize: PropTypes.number,
    finished: PropTypes.bool,
    initialized: PropTypes.bool,
    hide: PropTypes.func,
    onChange: PropTypes.func,
    password: PropTypes.string,
    error: PropTypes.bool,
  }

  render() {
    const {
      top,
      opacity,
      translate,
      logoHeight,
      logoMargin,
      h1Spacing,
      h2Spacing,
      h1FontSize,
      h2FontSize,
      finished,
      hide,
      password,
      onChange,
      error,
    } = this.props

    const correct = password === 'mv2018'

    return (
      <Wrapper translate={translate} top={top} mw={!finished ? 800 : 0}>
        {!!opacity && (
          <Logo
            style={{
              margin: `0 auto ${logoMargin}`,
              display: 'block',
              height: `${logoHeight}`,
              opacity,
            }}
          />
        )}
        {!!opacity && (
          <H1
            style={{ letterSpacing: h1Spacing, fontSize: h1FontSize, opacity }}
          >
            microverse
          </H1>
        )}
        {!!opacity && (
          <H2
            style={{
              letterSpacing: h2Spacing,
              fontSize: h2FontSize,
              color: '#ffffffdd',
              marginBottom: '2.5rem',
              opacity,
            }}
          >
            peer-to-peer compute network on blockchain
          </H2>
        )}
        {!!opacity && (
          <form onSubmit={hide}>
            {!correct && (
              <PasswordInput
                autoFocus
                className={error ? 'error' : ''}
                style={{ opacity }}
                placeholder="access code"
                value={password}
                onChange={onChange}
                type="password"
              />
            )}
            {correct && (
              <ButtonHero
                autoFocus
                type="submit"
                style={{ display: 'block', margin: '0 auto', opacity }}
              >
                BEGIN
              </ButtonHero>
            )}
            <Text
              mt={4}
              style={{
                color: '#f2e974',
                letterSpacing: '1',
                fontSize: '14px',
                opacity: correct ? opacity : 0,
              }}
            >
              * This is a CPU intensive visualization.
              <br />
              We recommend viewing it on a personal computer.
            </Text>
          </form>
        )}
      </Wrapper>
    )
  }
}

export default class Hero extends Component {
  static propTypes = {
    init: PropTypes.func.isRequired,
    initialized: PropTypes.bool.isRequired,
  }

  state = {
    theatrics: false,
    finished: false,
    password: 'mv2018',
    error: false,
  }

  onChange = event => {
    const password = event.target.value
    this.setState({ password, error: false })
  }

  hide = event => {
    event.preventDefault()
    const { password } = this.state
    if (password !== 'mv2018') return this.setState({ error: true })
    this.setState({ theatrics: true, error: false })
  }

  finish = () => {
    this.setState({ finished: true })
    this.props.init()
  }

  render() {
    const { initialized } = this.props
    const { theatrics, finished, password, error } = this.state
    const logoHeight = window.innerHeight > 812 ? 135 : 88
    return (
      <Box>
        <Spring
          from={{ color: 'black' }}
          to={{
            top: theatrics ? 32 : window.innerHeight / 2,
            translate: theatrics ? 0 : 50,
            opacity: theatrics ? 0 : 1,
            logoHeight: theatrics ? 56 : logoHeight,
            logoMargin: theatrics ? 16 : 48,
            h1Spacing: theatrics ? 4 : 8,
            h2Spacing: theatrics ? 0.5 : 1,
            h1FontSize: theatrics ? 16 : 26,
            h2FontSize: theatrics ? 12 : 20,
          }}
          finished={finished}
          hide={this.hide}
          onChange={this.onChange}
          password={password}
          error={error}
        >
          {props => <Content {...props} />}
        </Spring>
        {theatrics && (
          <Theatrics initialized={initialized} finish={this.finish} />
        )}
      </Box>
    )
  }
}

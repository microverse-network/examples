import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import { Relative } from 'rebass'

import { setSlide } from '../redux/drawing'
import media from '../utils/media'

import Logo from './Logo'
import GameWindow from './GameWindow'
import { Paragraph } from './Boxes'
import { Slide1 } from './slides/SlideBoxes'
import { NAV_LINKS } from './App'

const Nav = styled.ul`
  margin-top: 1rem;
  padding-right: 1rem;
  display: inline-block;
`

const NavItem = styled.li`
  letter-spacing: 2px;
  font-size: 0.75rem;
  line-height: 2rem;
`

const NavItemLogo = NavItem.extend`
  padding: 0 0 3rem;
  ${media.phone`
    padding: 0 0 1rem;
  `};
`

const defaultStyles = {
  letterSpacing: 2,
  fontSize: '0.75rem',
  lineHeight: '2rem',
}

const Arrow = styled.div`
  height: 6px;
  width: 6px;
  border-top: 1px solid #fff;
  border-right: 1px solid #fff;
  background: transparent;
  position: absolute;
  top: 134px;
  left: 32px;
  opacity: 1;
  transform: rotate(45deg);
  transition: top 0.5s ease, opacity 0.5s ease, left 0.5s ease;
  ${media.phone`
    left: 16px;
  `};
`

const NavLink = styled.a`
  font-family: var(--font-family-sans-serif);
  text-decoration: none;
  text-transform: uppercase;
  display: inline-block;
`

const Warning = Slide1.extend`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  padding: 1rem;
  margin-left: 0.5rem;
`

const WindowWrapper = Relative.extend`
  padding: 1rem 1rem 1rem 3rem;
  background-color: #09122300;
  transition: background-color 0.5s ease;
  ${media.tablet`
    padding: 1rem 1rem 1rem 2rem;
    &.solid {
      background-color: #091223dd;
      .arrow {
        opacity: 1;
      }
    }
    .arrow {
      opacity: 0;
    }
  `};
`

class StoryWindow extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    left: PropTypes.number,
    bottom: PropTypes.number,
    onTryClick: PropTypes.func,
    parallax: PropTypes.object,
    setSlide: PropTypes.func,
    offset: PropTypes.number,
    shouldDraw: PropTypes.bool,
  }

  static defaultProps = {
    left: 10,
    bottom: 110,
  }

  state = {
    show: false,
    showNav: true,
    warning: false,
  }

  componentDidMount() {
    const showNav = window.innerWidth > 600
    setTimeout(() => this.setState({ showNav }), 4000)
    this.setState({ show: true })
    this.timer = null
  }

  componentWillUnmount() {
    if (!this.timer) return
    clearTimeout(this.timer)
    this.timer = null
  }

  toggleNav = event => {
    this.setState({ showNav: !this.state.showNav })
  }

  removeWarning = event => this.setState({ warning: false })

  navClick = event => {
    const slide = parseInt(event.target.dataset.slide || 0, 10)
    const { offset, setSlide } = this.props
    this.setState({ showNav: window.innerWidth > 600 })
    if (slide === NAV_LINKS.length - 1) return this.onTry(event)
    if (offset !== slide) setSlide(slide)
  }

  onTry = event => {
    event.preventDefault()
    const { onTryClick, offset } = this.props
    if (window.innerWidth <= 600) {
      this.props.setSlide(0)
      setTimeout(() => this.setState({ warning: false }), 10000)
      return this.setState({ warning: true })
    }
    if (offset !== 0) {
      this.props.setSlide(0)
      const next = () => {
        const { shouldDraw } = this.props
        if (!shouldDraw) return requestAnimationFrame(next)
        onTryClick()
      }
      next()
    } else {
      onTryClick()
    }
  }

  render() {
    const { onClose, offset } = this.props
    const { show, showNav, warning } = this.state
    const isMobile = window.innerWidth <= 600
    const y = offset * 32 + (isMobile ? 102 : 134)
    return (
      <GameWindow
        width="auto"
        noClose={true}
        onClose={onClose}
        className={show ? 'in' : ''}
        style={{ padding: 0 }}
      >
        <WindowWrapper className={showNav && isMobile ? 'solid' : ''}>
          <Arrow className="arrow" style={{ top: y }} />
          <Nav>
            <NavItemLogo>
              <Logo
                onClick={
                  window.innerWidth <= 600 ? this.toggleNav : this.navClick
                }
                data-slide={0}
                style={{
                  display: 'block',
                  height: 42,
                  cursor: 'pointer',
                }}
              />
            </NavItemLogo>
            <Transition
              native
              keys={showNav ? NAV_LINKS.map(link => link.hash) : []}
              from={{ opacity: 0, height: 0 }}
              enter={{ opacity: 1, height: 32 }}
              leave={{ opacity: 0, height: 0 }}
            >
              {(showNav ? NAV_LINKS : []).map(
                ({ title, hash }, i) => styles => (
                  <animated.li style={{ ...defaultStyles, ...styles }}>
                    <NavLink
                      onClick={this.navClick}
                      data-slide={i}
                      href={`#${hash}`}
                    >
                      {title}
                    </NavLink>
                  </animated.li>
                ),
              )}
            </Transition>
          </Nav>
          {warning && (
            <Warning onClick={this.removeWarning}>
              <Paragraph style={{ marginBottom: 0, color: '#f1d17a' }}>
                Please open this page on your computer to test microverse.
              </Paragraph>
            </Warning>
          )}
        </WindowWrapper>
      </GameWindow>
    )
  }
}

export default connect(
  state => ({
    offset: state.drawing.parallax.offset,
    shouldDraw: state.drawing.shouldDraw,
  }),
  dispatch => ({
    setSlide: offset => dispatch(setSlide(offset)),
  }),
)(StoryWindow)

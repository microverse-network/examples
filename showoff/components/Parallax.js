import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Parallax as P } from 'react-spring'

import { setSlide, setSlideComplete } from '../redux/drawing'
import getRandomColor from '../utils/randomColor'

import App from './App'
import WindowContainer from './WindowContainer'
import {
  ProductSlide,
  PricingSlide,
  DeploySlide,
  DeployCodeSlide,
  TechnologySlide,
  TechnologyButtons,
  RevenueSlide,
  RevenueNumbers,
  RoadmapSlide,
  RoadmapSlideAll,
  RoadmapSlideFinished,
  RoadmapSlideRemaining,
  FooterSlide,
  FooterNavigation,
} from './slides'

import { ProductArt, DeployArt, RoadmapArt, TechArt } from './artwork'

let parallaxInstance

const adjust = (offset, tablet, phone) => {
  if (window.innerHeight <= 600) {
    offset += phone
  } else if (window.innerHeight <= 812) {
    offset += tablet
  }
  return offset
}

const flexStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const flexStart = {
  ...flexStyles,
  alignItems: 'flex-start',
}

// const flexEnd = {
//   ...flexStyles,
//   alignItems: 'flex-end',
// }

class Parallax extends Component {
  static propTypes = {
    peer: PropTypes.object,
    config: PropTypes.object,
    localPeer: PropTypes.object,
    initialized: PropTypes.bool,
    setSlide: PropTypes.func,
    setSlideComplete: PropTypes.func,
    parallax: PropTypes.object,
  }

  componentDidMount() {
    const checkOffset = () => {
      const { offset, current } = parallaxInstance
      const { setSlideComplete } = this.props
      const { offset: lastOffset, dirty } = this.props.parallax
      const inPlace = offset * window.innerHeight === current
      if (offset === lastOffset && dirty && inPlace) setSlideComplete()
      requestAnimationFrame(checkOffset)
    }
    requestAnimationFrame(checkOffset)
  }

  componentDidUpdate(prevProps) {
    const { offset } = this.props.parallax
    if (prevProps.parallax.offset !== offset) {
      parallaxInstance && parallaxInstance.scrollTo(offset)
    }
  }

  putSlides() {
    return [
      <P.Layer key={0} offset={1.1} speed={0.2} style={flexStart}>
        <ProductArt />
      </P.Layer>,

      <P.Layer key={1} offset={1} speed={0.2} style={flexStyles}>
        <ProductSlide />
      </P.Layer>,

      <P.Layer key={2} offset={1.3} speed={0.6} style={flexStyles}>
        <PricingSlide />
      </P.Layer>,

      <P.Layer
        key={3.1}
        offset={adjust(2.1, 0.025, 0.025)}
        speed={0.2}
        style={flexStart}
      >
        <DeployArt />
      </P.Layer>,

      <P.Layer key={3} offset={1.95} speed={0.1} style={flexStyles}>
        <DeploySlide />
      </P.Layer>,

      <P.Layer key={4} offset={2.2} speed={0.6} style={flexStyles}>
        <DeployCodeSlide />
      </P.Layer>,

      <P.Layer key={5.1} offset={3} speed={0.6} style={flexStart}>
        <TechArt
          x={window.innerWidth * 0.25}
          y={window.innerHeight * 0.3}
          starColor={getRandomColor('light', 'green')}
        />
      </P.Layer>,

      <P.Layer key={5.2} offset={3} speed={0.2} style={flexStart}>
        <TechArt
          x={window.innerWidth * 0.5}
          y={window.innerHeight * 0.2}
          count={50}
          starColor={getRandomColor('light', 'orange')}
        />
      </P.Layer>,

      <P.Layer key={5.3} offset={3} speed={0.4} style={flexStart}>
        <TechArt
          x={window.innerWidth * 0.75}
          y={window.innerHeight * 0.3}
          starColor={getRandomColor('light', 'pink')}
        />
      </P.Layer>,

      <P.Layer key={5} offset={3} speed={-0} style={flexStyles}>
        <TechnologySlide />
      </P.Layer>,

      <P.Layer key={6} offset={3.3} speed={0.4} style={flexStyles}>
        <TechnologyButtons />
      </P.Layer>,

      <P.Layer
        key={8}
        offset={adjust(3.85, -0.05, -0.05)}
        speed={-0}
        style={flexStyles}
      >
        <RevenueSlide />
      </P.Layer>,

      <P.Layer
        key={7}
        offset={adjust(4.2, 0.05, 0.05)}
        speed={0.4}
        style={{ ...flexStyles, justifyContent: 'space-between' }}
      >
        <RevenueNumbers />
      </P.Layer>,

      <P.Layer key={9.1} offset={5.05} speed={0.2} style={flexStart}>
        <RoadmapArt />
      </P.Layer>,

      <P.Layer key={9} offset={4.8} speed={-0} style={flexStyles}>
        <RoadmapSlide />
      </P.Layer>,

      // if phone or tablet 0, if desktop 1
      adjust(1, -1, -1) ? (
        <P.Layer key={10} offset={5.1} speed={0.5} style={flexStyles}>
          <RoadmapSlideFinished />
        </P.Layer>
      ) : (
        <P.Layer key={10} offset={5.25} speed={0.5} style={flexStyles}>
          <RoadmapSlideAll />
        </P.Layer>
      ),
      !!adjust(1, -1, -1) && (
        <P.Layer key={11} offset={5.2} speed={0.5} style={flexStyles}>
          <RoadmapSlideRemaining />
        </P.Layer>
      ),

      <P.Layer key={12} offset={5.9} speed={-0} style={flexStyles}>
        <FooterSlide />
      </P.Layer>,

      <P.Layer key={12.1} offset={6.1} speed={0.4} style={flexStyles}>
        <FooterNavigation />
      </P.Layer>,
    ]
  }

  render() {
    const { peer, config, localPeer, initialized } = this.props
    return (
      <div>
        <P ref={ref => (parallaxInstance = ref)} pages={7} scrolling={false}>
          <P.Layer offset={0} speed={0.1}>
            <App peer={peer} config={config} localPeer={localPeer} />
          </P.Layer>
          {initialized && this.putSlides()}
        </P>
        {initialized && <WindowContainer placement="primary" />}
      </div>
    )
  }
}

export default connect(
  state => ({
    initialized: state.drawing.initialized,
    parallax: state.drawing.parallax,
  }),
  dispatch => ({
    setSlide: offset => dispatch(setSlide(offset)),
    setSlideComplete: () => dispatch(setSlideComplete()),
  }),
)(Parallax)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Spring } from 'react-spring'
import numeral from 'numeral'
import { Text } from 'rebass'

import { TopLabel, TopLabelWrapper, Strip, Title1 } from '../Boxes'
import media from '../../utils/media'

const Unit = Text.extend`
  display: inline;
  font-size: 12px;
  color: #88939a;
  font-family: var(--font-family-monospace);
  line-height: 2rem;
  white-space: nowrap;
  ${media.tablet`
    line-height: 1.25rem;
    white-space: normal;
  `};
  ${media.phone`
    font-size: 10px;
    line-height: 0.75rem;
  `};
`

const StatWrapper = TopLabelWrapper.extend`
  font-size: 2.9rem;
  ${media.tablet`
    line-height: 2.25rem !important;
    font-size: 1.75rem !important;
    margin-bottom: 1rem;
  `};
  ${media.phone`
    line-height: 2rem !important;
    font-size: 1.5rem !important;
    margin-bottom: 1rem;
  `};
`

const StatLabel = TopLabel.extend`
  line-height: 2rem;
  color: #ffffffee;
  text-transform: none;
  ${media.tablet`
    margin-bottom: 0;
    line-height: 1.5rem;
  `};
  ${media.phone`
    line-height: 1rem;
  `};
`

const Strip1 = Strip.extend`
  ${media.phone`
    flex-wrap: wrap;
  `};
`

class Stats extends Component {
  static propTypes = {
    shouldDraw: PropTypes.bool,
    stats: PropTypes.array,
    title: PropTypes.string,
    fontSize: PropTypes.any,
    suffix: PropTypes.string,
  }

  static defaultProps = {
    suffix: '',
  }

  render() {
    const { title, stats, shouldDraw, fontSize, suffix } = this.props
    return (
      <div>
        <Strip1>
          {stats.map(stat => (
            <StatWrapper key={stat.label} style={fontSize ? { fontSize } : {}}>
              <StatLabel>{stat.label}</StatLabel>
              <Spring
                from={{ value: 0 }}
                to={{ value: shouldDraw ? stat.value : 0 }}
              >
                {({ value }) => numeral(value).format(stat.format) + suffix}
              </Spring>
              <br />
              <Unit>{stat.unit}</Unit>
            </StatWrapper>
          ))}
        </Strip1>
        {title && <Title1>{title}</Title1>}
      </div>
    )
  }
}

export default connect((state, props) => ({
  shouldDraw:
    state.drawing.parallax.offset === props.offset &&
    !state.drawing.parallax.dirty,
}))(Stats)

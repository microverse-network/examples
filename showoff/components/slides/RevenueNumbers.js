import React from 'react'
import { Tooltip } from 'react-tippy'
import Stats from './Stats'
import { TooltipInner } from '../Boxes'
import { Slide1, H12, Box1, LinkButton } from './SlideBoxes'

const MAU = 200000000
const COST_PER_HOUR = 0.15 // c5 xlarge
const SESSION_LENGTH = 17.5 // minutes

const RevenueNumbers = () => {
  return (
    <Slide1>
      <Tooltip
        theme="light"
        position="bottom"
        html={
          <TooltipInner style={{ textShadow: 'none' }}>
            Approximate revenue on 1000 real-time users.
          </TooltipInner>
        }
      >
        <H12>ARR Examples</H12>
      </Tooltip>
      <Stats
        offset={4}
        fontSize="2.5rem"
        suffix="M"
        stats={[
          {
            label: 'Pinterest',
            format: '$0,0',
            value: (MAU * 12 * COST_PER_HOUR * SESSION_LENGTH) / 60 / 1e6,
            unit: '200M MAU, 17.5min/user',
          },
          {
            label: 'YouTube',
            format: '$0,0',
            value: (1.57e9 * 12 * COST_PER_HOUR * 40) / 60 / 1e6,
            unit: '1.57B MAU, 40min/user',
          },
          {
            label: 'Wikipedia',
            format: '$0,0',
            value: (4.5e8 * 12 * COST_PER_HOUR * 23) / 60 / 1e6,
            unit: '450M MAU, 23min/user',
          },
          {
            label: 'LinkedIn',
            format: '$0,0',
            value: (2.5e8 * 12 * COST_PER_HOUR * 10) / 60 / 1e6,
            unit: '250M MAU, 10min/user',
          },
        ]}
      />
      <Box1>
        <LinkButton href="mailto:hello@microverse.network?subject=microverse%20intro">
          Request Information
        </LinkButton>
      </Box1>
    </Slide1>
  )
}

export default RevenueNumbers

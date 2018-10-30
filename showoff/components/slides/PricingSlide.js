import React from 'react'
import { Tooltip } from 'react-tippy'
import Stats from './Stats'
import { TooltipInner } from '../Boxes'
import { Slide1, H12, Box1, Button } from './SlideBoxes'

const PricingSlide = () => {
  return (
    <Tooltip
      theme="light"
      position="bottom"
      html={
        <TooltipInner style={{ textShadow: 'none' }}>
          Nodes set their own prices similar to gas prices on Ethereum network.
          Microverse routes calls to the cheapest/closest available.
        </TooltipInner>
      }
    >
      <Slide1>
        <H12>Let your resources start making money</H12>
        <Stats
          offset={1}
          stats={[
            {
              label: 'CPU:',
              format: '$0,0.00',
              value: 0.1,
              unit: 'per million reqs',
            },
            {
              label: 'STORAGE:',
              format: '$0,0.00',
              value: 0.05,
              unit: 'per month per gb',
            },
            {
              label: 'BANDWIDTH:',
              format: '$0,0.00',
              value: 0.05,
              unit: 'per month per gb',
            },
          ]}
        />
        <Box1>
          <Tooltip
            theme="light"
            position="top"
            html={
              <TooltipInner style={{ textShadow: 'none' }}>
                Coming soon…
              </TooltipInner>
            }
          >
            <Button>Download Microverse</Button>
          </Tooltip>
        </Box1>
      </Slide1>
    </Tooltip>
  )
}

export default PricingSlide

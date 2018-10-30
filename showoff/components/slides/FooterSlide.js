import React from 'react'
import { Tooltip } from 'react-tippy'

import { H11, TooltipInner } from '../Boxes'
import { Slide, Button } from './SlideBoxes'

const FooterSlide = () => {
  return (
    <Slide>
      <H11>Join Microverse</H11>
    </Slide>
  )
}

export const FooterNavigation = () => {
  return (
    <Slide>
      <Tooltip
        theme="light"
        position="top"
        html={
          <TooltipInner style={{ textShadow: 'none' }}>
            Coming soon…
          </TooltipInner>
        }
      >
        <Button>Download Microverse Browser Extension</Button>
      </Tooltip>
      <Tooltip
        theme="light"
        position="top"
        html={
          <TooltipInner style={{ textShadow: 'none' }}>
            Coming soon…
          </TooltipInner>
        }
      >
        <Button>Download Microverse Miner</Button>
      </Tooltip>
    </Slide>
  )
}

export default FooterSlide
// <FooterNav>
//   <div>
//     <FooterLink href="#">Telegram</FooterLink>
//   </div>
//   <div>
//     <FooterLink href="#">Twitter</FooterLink>
//   </div>
//   <div>
//     <FooterLink href="#">Reddit</FooterLink>
//   </div>
//   <div>
//     <FooterLink href="#">Microverse Blog</FooterLink>
//   </div>
// </FooterNav>

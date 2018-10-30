import React from 'react'
import { H11 } from '../Boxes'
import { Slide, Paragraph1 } from './SlideBoxes'

const DeploySlide = () => {
  // Currently supporting only
  //        Node.js and javascript applications; in the future there will be
  //        adapters to enable other languages too.
  return (
    <Slide>
      <H11>Deploy any JS Application</H11>
      <Paragraph1>
        Once an application is deployed to the network, chosen dependencies will
        be converted to microservices and will be automatically distributed to
        peers. Most codebases should just work as is.
      </Paragraph1>
    </Slide>
  )
}

export default DeploySlide

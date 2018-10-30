import React from 'react'
import { H11 } from '../Boxes'
import { Slide, Paragraph1, Code1, LinkButton } from './SlideBoxes'

const TechnologySlide = () => {
  return (
    <Slide>
      <H11>Technology</H11>
      <Paragraph1>
        Microverse is built on a peer-to-peer replicatable gossip data structure
        known as <Code1>Scuttlebutt</Code1> coupled with{' '}
        <Code1>Hyperledger</Code1>, The Linux Foundation{"'"}s blockchain
        technology. This allows microverse to be a huge compute cloud with a
        blockchain to transparently handle the accounting.
      </Paragraph1>
    </Slide>
  )
}

export const TechnologyButtons = () => {
  return (
    <Slide>
      <LinkButton
        href="http://www.cs.cornell.edu/home/rvr/papers/flowgossip.pdf"
        target="_blank"
      >
        Scuttlebutt Whitepaper
      </LinkButton>
      <LinkButton href="http://hyperledger.org/" target="_blank">
        Hyperledger Website
      </LinkButton>
    </Slide>
  )
}

export default TechnologySlide

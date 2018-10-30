import React from 'react'
import { H11 } from '../Boxes'
import { Slide, Paragraph1 } from './SlideBoxes'
import media from '../../utils/media'

const PSlide = Slide.extend`
  ${media.tablet`
    margin-top: -12rem;
  `};
`

const ProductSlide = () => {
  return (
    <PSlide>
      <H11>A compute cloud created by everyone</H11>
      <Paragraph1>
        It{"'"}s like distributed AWS. Every connected device can receive and
        respond to compute requests. Browsers, IoT devices, servers can make
        money by joining the network.
      </Paragraph1>
    </PSlide>
  )
}

export default ProductSlide

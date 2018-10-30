import styled from 'styled-components'
import {
  Label,
  Flex,
  Code as Code_,
  Box,
  Select,
  Border,
  Text,
  Heading as H,
} from 'rebass'
import media from '../utils/media'

export const Heading = H.extend`
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
`

export const H1 = Box.extend`
  font-size: 1.625rem;
  font-weight: 300;
  text-align: center;
  margin-bottom: 1rem;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
`
export const H11 = Box.extend`
  font-size: 3rem;
  margin-bottom: 1rem;
  ${media.desktop`
    font-size: 2rem;
    padding: 0.5rem 1rem 0.4rem;
  `};
  ${media.tablet`
    font-size: 2rem;
    padding: 0.5rem 1rem 0.4rem;
  `};
  ${media.phone`
    font-size: 1.5rem;
  `};
`
export const H2 = Box.extend`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #ffffff;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  ${media.tablet`
    font-size: 1rem;
    margin-bottom: 1rem;
    padding: 0.5rem 1rem 0.4rem;
  `};
  ${media.phone`
    font-size: 0.875rem;
  `};
`

export const Selector = Select.extend`
  flex: 0 1 auto;
  background-color: #00000044;
  box-shadow: none;
  border: 1px solid #ffffff22;
  border-color: #ffffff22 #ffffff33 #ffffff33 #ffffff22;
  border-radius: 0;
  font-weight: 400;
  font-size: 0.75rem;
  font-family: var(--font-family-sans-serif);
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  width: auto;
  max-width: 180px;
  line-height: 13px;
`

export const Title = Box.extend`
  flex: 1 1 auto;
  font-size: 1rem;
  font-weight: 400;
  padding: 0.5rem 0;
  color: #ffffff;
  border-bottom: 1px solid #ffffff11;
  cursor: pointer;
  outline: none;
  position: relative;
`

export const Pill = Box.extend`
  background-color: #71c21a;
  width: 12px;
  height: 12px;
  flex: 0 0 auto;
  margin: 0 12px 0 0;
  border-radius: 6px;
  display: block;
`

export const Paragraph = Box.extend`
  margin: 0 0 1rem 0;
  border-radius: 6px;
  display: block;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.667);
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
`
export const Paragraph1 = Paragraph.extend`
  font-size: 1.5rem;
  ${media.desktop`
    font-size: 1rem;
    padding: 0 1rem;
  `};
`

export const LogBox = Border.extend`
  padding: 0.5rem;
  margin-top: 0.5rem;
  background-color: #29314588;
  overflow: auto;
  height: 100%;
  border-color: rgba(255, 255, 255, 0.2);
`

export const LineNr = Code_.extend`
  color: #aaaaaa;
  font-size: 10px;
  font-family: var(--font-family-monospace);
`

export const Code = Code_.extend`
  font-family: var(--font-family-monospace);
`

export const Source = Text.extend`
  color: #86f9b1;
  display: inline;
  padding-left: 0.5rem;
  line-height: 1rem;
`
export const You = Text.extend`
  color: #f77d7b;
  display: inline;
  padding-left: 0.5rem;
  line-height: 1rem;
`

const Node = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: transparent url('../assets/nodes/chrome-node.svg') center center
    no-repeat;
  background-size: 16px 16px;
  vertical-align: middle;
`

export const NodeLogos = {
  Chrome: Node.extend`
    background-image: url('../assets/nodes/chrome-node.svg');
  `,
  Firefox: Node.extend`
    background-image: url('../assets/nodes/firefox-node.svg');
  `,
  Safari: Node.extend`
    background-image: url('../assets/nodes/safari-node.svg');
  `,
  Nodejs: Node.extend`
    background-image: url('../assets/nodes/node.js-node.svg');
  `,
  GoLang: Node.extend`
    background-image: url('../assets/nodes/go-node.svg');
  `,
  Opera: Node.extend`
    background-image: url('../assets/nodes/opera-node.svg');
  `,
  Edge: Node.extend`
    background-image: url('../assets/nodes/edge-node.svg');
  `,
}

export const TopLabel = Label.extend`
  color: #88939a;
  display: block;
  font-family: var(--font-family-monospace);
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 200;
  line-height: 1rem;
  white-space: nowrap;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  ${media.tablet`
    font-size: 0.675rem;
    white-space: wrap;
  `};
`
export const Title1 = TopLabel.extend`
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 8px;
  text-align: center;
  margin-top: 12px;
  color: #73a4c1;
  font-size: 12px;
  ${media.tablet`
    letter-spacing: 4px;
  `};
`

export const TopLabelWrapper = Box.extend`
  font-size: 2rem;
  line-height: 2rem;
  min-width: 80;
  margin: 0 2rem;
  text-align: center;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  ${media.tablet`
    min-width: 0;
    margin: 0 0.5rem 1rem;
    line-height: 2.25rem;
    font-size: 1.5rem;
  `};
  ${media.phone`
    margin: 0 0 0.5rem;
  `};
`

export const TooltipInner = Box.extend`
  text-align: left;
`

export const Strip = Flex.extend`
  flex: 0 1 auto;
  align-items: center;
  justify-content: center;
  ${media.tablet`
    flex-wrap: wrap;
    justify-content: space-around;
  `};
`

export const GameWindowInner = Box.extend`
  ${media.tablet`
    display: none;
  `};
`

import styled from 'styled-components'
import { Box, Text, Link } from 'rebass'
import { ActionButton as B } from '../GradientButton'
import { H11, Paragraph1 as P, Strip } from '../Boxes'
import media from '../../utils/media'

export const Slide = Box.extend`
  text-align: center;
  max-width: 800;
  margin: 0 auto;
  ${media.tablet`
    min-width: 300px;
    max-width: 90%;
  `};
`

export const Slide1 = Slide.extend`
  border: 1px solid #f1d17a88;
  background-color: #f1d17a11;
  max-width: 1024px;
  ${media.tablet`
    max-width: 90%;
  `};
`

export const Paragraph1 = P.extend`
  margin-bottom: 1rem;
  ${media.tablet`
    font-size: 1rem;
    padding: 0 1rem;
  `};
`

export const CodeParagraph = Paragraph1.extend`
  margin-bottom: 0.875rem;
  font-size: 1rem;
  ${media.tablet`
    padding: 0;
    margin-bottom: 0;
    font-size: 0.675rem;
    pre {
      width: 100%;
      padding: 0.5rem !important;
    }
  `};
`

export const Button = B.extend`
  font-size: 1.125rem;
  margin: 1rem 1rem 0 0;
  padding: 10px 24px;
  background: transparent;
  border-color: #ffffff44;
  ${media.tablet`
    font-size: 1rem;
  `};
  ${media.phone`
    font-size: 0.875rem;
  `};
`

export const Code = Text.extend`
  font-family: var(--font-family-monospace);
  margin: 0 0.5rem;
  display: inline;
`

export const Code1 = Text.extend`
  color: white;
  display: inline;
`

// font-family: var(--font-family-monospace);
export const H12 = H11.extend`
  letter-spacing: 0.125rem;
  color: #f1d17a;
  font-size: 1rem;
  text-transform: uppercase;
  padding-top: 1rem;
  border-bottom: 1px solid #f1d17a88;
  padding-bottom: 0.8rem;
  ${media.tablet`
    font-size: 0.875rem;
  `};
  ${media.phone`
    font-size: 0.75rem;
  `};
`

export const Box1 = Box.extend`
  padding-top: 1rem;
  padding-bottom: 0.8rem;
  button,
  a {
    border-color: #f1d17a88;
    color: #f1d17a;
    background-color: #f1d17a22;
    margin: 0;
  }
`

export const Quarter = Text.extend`
  font-size: 1rem;
  color: #88939a;
  font-family: var(--font-family-monospace);
  ${media.tablet`
    font-size: 0.75rem;
  `};
  ${media.phone`
    font-size: 0.65rem;
  `};
`

export const Task = Text.extend`
  padding: 0 0 0.5rem 2rem;
  font-size: 2rem;
  line-height: 1.2;
  letter-spacing: 1px;
  &.completed {
    font-family: var(--font-family-monospace);
    font-size: 1rem;
    color: #88939a99;
    line-height: 1;
  }
  ${media.tablet`
    line-height: 1.6;
    font-size: 1rem;
    &.completed {
      font-size: 0.75rem;
    }
  `};
  ${media.phone`
    font-size: 1rem;
    padding: 0 1rem;
    &.completed {
      font-size: 0.65rem;
    }
  `};
`

export const Row = styled.tr`
  color: #c4fffe;
  &.completed {
    color: #88939a;
  }
  &.active {
    color: #f2e974;
  }
`

export const Accent = Text.extend`
  color: #fc94f8;
  display: inline;
`

export const FooterLink = Link.extend`
  font-size: 2rem;
  padding: 1rem 2rem;
  color: white;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom: 1px solid #fff;
  }
`

export const FooterNav = Strip.extend`
  margin-bottom: 2rem;
`

export const LinkButton = styled.a`
  line-height: 1.1428571428571428;
  display: inline-block;
  vertical-align: middle;
  margin: 1rem 1rem 0 0;
  padding: 10px 24px;

  color: white;
  appearance: none;
  border: 1px solid #ffffff44;
  background: transparent;

  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 200;
  font-family: var(--font-family-sans-serif);
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  text-shadow: 0 1px 1px #000000;
  letter-spacing: 1px;

  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: grayscale;
`

import { Box } from 'rebass'

const Card = Box.extend`
  background: transparent;
  border: none;
  opacity: 0;
  transition: opacity 1s ease;
  &.in {
    opacity: 1;
  }
`

export default Card

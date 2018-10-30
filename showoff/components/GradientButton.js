import { Button as B } from 'rebass'

export const Button = B.extend`
  background-color: transparent;
  border: none;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 200;
  font-family: var(--font-family-sans-serif);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transform: translateY(0);
  transition: transform 0.177s ease;
  text-shadow: 0 1px 1px #000000;
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: grayscale;
  &.active,
  &:hover {
    background-color: transparent;
    transform: translateY(-6px);
    box-shadow: none;
    border-bottom: 1px solid #ffffff66;
  }
`
export const ButtonHero = Button.extend`
  border: 1px solid #ffffff66;
  font-size: 1rem;
  letter-spacing: 0.5rem;
  padding-left: 1.5rem;
  transition: transform 0.177s ease, border-color 0.177s ease;
  &.active,
  &:hover {
    transform: translateY(0);
    border: 1px solid #ffffffaa;
  }
`
export const ActionButton = B.extend`
  background-color: #00000044;
  border: 1px solid #ffffff22;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 200;
  font-family: var(--font-family-sans-serif);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 1px #000000;
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: grayscale;
`
export default Button

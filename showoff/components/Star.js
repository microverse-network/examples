import { CustomPIXIComponent } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'
const noop = () => {}
const TYPE = 'Star'
export const behavior = {
  customDisplayObject: props => new PIXI.Graphics(),
  customApplyProps(instance, oldProps, newProps) {
    const { fill, x, y, radius, onClick, onHover } = newProps
    if (typeof oldProps !== 'undefined') {
      instance.clear()
    }
    instance.beginFill(fill)
    instance.drawStar(x, y, 4, radius)
    instance.endFill()
    instance.interactive = !!(onClick || onHover)
    instance.buttonMode = !!(onClick || onHover)
    instance.click = onClick || noop
    instance.mouseover = onHover || noop
  },
}
export default CustomPIXIComponent(behavior, TYPE)

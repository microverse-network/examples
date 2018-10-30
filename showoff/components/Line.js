import { CustomPIXIComponent } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'

export const behavior = {
  customDisplayObject: props => new PIXI.Graphics(),
  customApplyProps(instance, oldProps, newProps) {
    const {
      fill,
      from,
      lineWidth = 1,
      to,
      scale = { x: 1, y: 1 },
      opacity = 0.2,
    } = newProps
    instance.clear()
    instance.lineStyle(lineWidth / scale.x, fill, opacity)
    instance.moveTo(from.x, from.y)
    instance.lineTo(to.x, to.y)
  },
}
export default CustomPIXIComponent(behavior, 'Line')

import { CustomPIXIComponent } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'

export const behavior = {
  customDisplayObject: props => new PIXI.Graphics(),
  customApplyProps(instance, oldProps, newProps) {
    const { width, height, name, opacity, steps, lineStyles } = newProps

    if (typeof oldProps !== 'undefined') instance.clear()

    if (name) instance.name = name
    if (opacity !== undefined) {
      instance.alpha = opacity
    }

    instance.lineStyle(...lineStyles)
    instance.moveTo(0, 0)
    Array(Math.floor(height / steps))
      .fill(true)
      .map((x, i) => {
        instance.lineTo(width, i * steps)
        instance.moveTo(0, (i + 1) * steps)
      })
  },
}

export default CustomPIXIComponent(behavior, 'Interlace')

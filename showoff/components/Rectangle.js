import { CustomPIXIComponent } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'

const TYPE = 'Rect'
export const behavior = {
  customDisplayObject: props => new PIXI.Graphics(),
  customApplyProps: (instance, oldProps, newProps) => {
    const {
      fill,
      x,
      y,
      width,
      height,
      lineWidth = 0,
      lineColor = 0,
      lineAlpha = 0.3,
      radius = 0,
      alpha = 1,
    } = newProps
    if (typeof oldProps !== 'undefined') {
      instance.clear()
    }

    if (fill) instance.beginFill(fill, alpha)

    if (lineWidth) instance.lineStyle(lineWidth, lineColor, lineAlpha)

    if (radius) {
      instance.drawRoundedRect(x, y, width, height, radius)
    } else {
      instance.drawRect(x, y, width, height)
    }

    if (fill) instance.endFill()
  },
}

export default CustomPIXIComponent(behavior, TYPE)

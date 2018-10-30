import { CustomPIXIComponent } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'

export const behavior = {
  customDisplayObject: props => new PIXI.Graphics(),
  customApplyProps(instance, oldProps, newProps) {
    const {
      width,
      height,
      name,
      fill,
      opacity,
      // onClick,
      // onMouseDown,
      // onMouseUp,
      // onMouseOver,
      // onMouseOut,
    } = newProps

    if (typeof oldProps !== 'undefined') instance.clear()

    if (name) instance.name = name
    if (opacity !== undefined) {
      instance.alpha = opacity
    }

    instance.lineStyle(1, 0xff0000, 1)
    instance.beginFill(fill || 0xffffff)

    const points = [
      [0, height - (height / 10) * 3],
      [width / 5, height / 2, width / 30, height / 8],
      [(width / 10) * 7, height / 2.5, width / 2.5, -height / 3],
      [width, height - height / 5, width * 0.9, height / 8],
      [(width / 10) * 7, height, width, height * 1.05],
      [(width / 10) * 3, height],
      [0, height - (height / 10) * 3, width / 50, height * 1.05],
    ]

    points.forEach(([x, y, cx, cy], i) => {
      if (i === 0) return instance.moveTo(x, y)
      if (cx) return instance.quadraticCurveTo(cx, cy, x, y)
      instance.lineTo(x, y)
    })

    if (fill) instance.endFill()

    // if (onClick || onMouseDown || onMouseUp || onMouseOver) {
    //   instance.interactive = true
    //   instance.buttonMode = true
    // }
    // if (onClick) instance.click = onClick
    // if (onMouseDown) instance.mousedown = onMouseDown
    // if (onMouseUp) instance.mouseup = onMouseUp
    // if (onMouseOver) instance.mouseover = onMouseOver
    // if (onMouseOut) instance.mouseout = onMouseOut
  },
}

export default CustomPIXIComponent(behavior, 'Cloud')

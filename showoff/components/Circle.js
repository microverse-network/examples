import { CustomPIXIComponent } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'

export const behavior = {
  customDisplayObject: props => new PIXI.Graphics(),
  customApplyProps(instance, oldProps, newProps) {
    const {
      fake,
      x,
      y,
      onClick,
      lineStyle,
      opacity,
      radius,
      flicker,
      onMouseDown,
      onMouseUp,
      onMouseOver,
      onMouseOut,
    } = newProps
    let fill = fake ? 0x47eed4 : newProps.fill

    if (typeof oldProps !== 'undefined') {
      instance.clear()
    }

    if (opacity !== undefined) {
      instance.alpha = opacity
    }
    if (flicker) {
      instance.alpha = Math.max(0.75, Math.random())
    }
    if (lineStyle) instance.lineStyle(...lineStyle)
    if (fill) instance.beginFill(fill)
    instance.drawCircle(x, y, radius)
    if (fill) instance.endFill()
    if (onClick || onMouseDown || onMouseUp || onMouseOver) {
      instance.interactive = true
      instance.buttonMode = true
    }
    if (onClick) instance.click = onClick
    if (onMouseDown) instance.mousedown = onMouseDown
    if (onMouseUp) instance.mouseup = onMouseUp
    if (onMouseOver) instance.mouseover = onMouseOver
    if (onMouseOut) instance.mouseout = onMouseOut
  },
}

export default CustomPIXIComponent(behavior, 'Circle')

import { CustomPIXIComponent } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'

const TYPE = 'Background'
export const behavior = {
  customDisplayObject: props => new PIXI.Container(),
  customApplyProps(instance, oldProps, newProps) {
    const { size, image, type, forceSize } = newProps

    const sprite = PIXI.Sprite.fromImage(image)
    const mask = new PIXI.Graphics()
      .beginFill(0x8bc5ff)
      .drawRect(0, 0, size.x, size.y)
      .endFill()
    instance.mask = mask
    instance.addChild(mask)
    instance.addChild(sprite)

    let sp = { x: sprite.width, y: sprite.height }
    if (forceSize) sp = forceSize
    const winratio = size.x / size.y
    const spratio = sp.x / sp.y
    let scale = 1
    const pos = new PIXI.Point(0, 0)
    if (type === 'cover' ? winratio > spratio : winratio < spratio) {
      // photo is wider than background
      scale = size.x / sp.x
      pos.y = -(sp.y * scale - size.y) / 2
    } else {
      // photo is taller than background
      scale = size.y / sp.y
      pos.x = -(sp.x * scale - size.x) / 2
    }

    sprite.scale = new PIXI.Point(scale, scale)
    sprite.position = pos
  },
}
export default CustomPIXIComponent(behavior, TYPE)

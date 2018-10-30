export const getRelativeCoords = (main, relative, scale, manual) => {
  if (manual) {
    scale = { x: 1, y: 1 }
  }
  return {
    x: relative.x / scale.x - main.x / scale.x,
    y: relative.y / scale.y - main.y / scale.y,
  }
}

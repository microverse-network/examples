/*
t: current time/current step
b: starting position
c: amount of change (end - start)
d: total animation time/steps
*/

export const easeOutBack = (t, b, c, d, s) => {
  if (s === undefined) s = 1.70158
  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
}

export const easeOutQuad = (t, b, c, d) => {
  return -c * (t /= d) * (t - 2) + b
}

export const easeInOutBack = (t, b, c, d, s) => {
  if (s === undefined) s = 1.70158
  if ((t /= d / 2) < 1) {
    return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b
  }
  return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
}

export const easeInSine = (t, b, c, d) => {
  return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b
}

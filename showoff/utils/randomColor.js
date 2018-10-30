import randomColor from 'randomcolor'

const getRandomColor = (luminosity = 'light', hue = 'random') =>
  parseInt(randomColor({ luminosity, hue }).replace('#', '0x'), 16)

export default getRandomColor

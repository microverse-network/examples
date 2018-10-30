require('jimp/browser/lib/jimp')
const jimp = self.Jimp

export default async original => {
  const i = await jimp.read(original)
  return new Promise((resolve, reject) => {
    i.grayscale().getBase64(jimp.AUTO, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}

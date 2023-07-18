const fs = require('fs') // 引入 fs 模組
const { ImgurClient } = require('imgur')
const { errorToFront } = require('../middleware/error-handler')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const imgur = new ImgurClient({ clientId: IMGUR_CLIENT_ID })
const IMAGE_MAX = 2 * 1024 * 1024

const imgurFileHandler = file => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file) return resolve(null)
      if (file.size > IMAGE_MAX) throw new errorToFront('請上傳2MB以下的檔案')
      const img = await imgur.upload({
        image: fs.createReadStream(file.path)
      })
      return resolve(img?.data.link || null)
    } catch (err) { reject(err) }
  })
}

module.exports = {
  imgurFileHandler
}

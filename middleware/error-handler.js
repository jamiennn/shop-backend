// 定義要傳給前端的error
class errorToFront extends Error {
  constructor(message) {
    super(message)
    this.name = "errorToFront"
  }
}

const errorHandler = (err, req, res, next) => {
  if (err.name === 'errorToFront') {
    let messages

    // 如果錯誤是 express-validator 產生的一個陣列 (轉的字串)，就傳給前端
    if (err.message.slice(0, 1) === '[') {
      messages = JSON.parse(err.message)
    } else {
      messages = err.message
    }
    res.status(500).json({
      status: 'error',
      messages
    })
  } else {
    console.error(err)
  }
}

module.exports = { errorHandler, errorToFront }
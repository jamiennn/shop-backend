const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res, next) => {
  res.json({
    "message": "hello world"
  })
})

const { User } = require('./models')
async function test() {
  const users = await User.findAll({ raw: true })
  console.log(users)
}

test()

app.listen(port, () => {
  console.log(`Now listening on http://localhost:${port}`)
})
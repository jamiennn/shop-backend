const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res, next) => {
  res.json({
    "message": "hello world"
  })
})

app.listen(port, () => {
  console.log(`Now listening on http://localhost:${port}`)
})
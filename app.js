if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const passport = require('./config/passport')
const router = require('./routes')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

app.use(router)

app.listen(port, () => {
  console.log(`Now listening on http://localhost:${port}`)
})
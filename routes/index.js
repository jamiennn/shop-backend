const express = require('express')
const router = express.Router()

const users = require('./modules/user')
const products = require('./modules/product')
const carts = require('./modules/cart')
const orders = require('./modules/order')
const { errorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.use('/api/products', products)
router.use('/api/orders', authenticated, orders)
router.use('/api/carts', authenticated, carts)
router.use('/api/users', users)

router.use('/api', errorHandler)

module.exports = router
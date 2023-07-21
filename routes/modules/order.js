const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/order-controller')

router.get('/:oid', orderController.getOrder)

module.exports = router
const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/order-controller')

router.put('/orderItems/:orderItemId', orderController.putOrderItem)
router.delete('/orderItems/:orderItemId', orderController.deleteOrderItem)
router.get('/:oid', orderController.getOrder)
router.post('/:oid', orderController.checkOutOrder)

module.exports = router
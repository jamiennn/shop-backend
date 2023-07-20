const express = require('express')
const router = express.Router()

const cartController = require('../../controllers/cart-controller')

router.get('/:uid', cartController.getCartItems)
router.put('/:cid', cartController.putCartItem)
router.delete('/:cid', cartController.deleteCartItem)
router.post('/', cartController.postCartItem)

module.exports = router
const express = require('express')
const router = express.Router()

const cartController = require('../../controllers/cart-controller')

router.post('/checkout', cartController.checkoutCart)
router.put('/:cid', cartController.putCartItem)
router.delete('/:cid', cartController.deleteCartItem)
router.post('/', cartController.postCartItem)
router.get('/', cartController.getCartItems)

module.exports = router
const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product-controller')

router.get('/:pid', productController.getProduct)
router.post('/', productController.postProduct)
router.get('/', productController.getProducts)

module.exports = router
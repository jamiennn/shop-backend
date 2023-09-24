const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

const productController = require('../../controllers/product-controller')

router.get('/categories', productController.getCategories)
router.get('/:pid', productController.getProduct)
router.patch('/:pid', authenticated, productController.patchProduct)
router.put('/:pid', authenticated, upload.single('image'), productController.putProduct)
router.post('/', authenticated, upload.single('image'), productController.postProduct)
router.get('/', productController.getProducts)

module.exports = router
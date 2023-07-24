const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const productController = require('../../controllers/product-controller')

const { authenticated } = require('../../middleware/auth')

router.get('/:uid/products', productController.getProducts)
router.get('/test-token', authenticated, userController.testToken)
router.post('/register', userController.register)
router.post('/login', userController.logIn)
router.get('/:uid', userController.getUser)

module.exports = router
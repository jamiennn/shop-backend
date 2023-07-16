const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

const { authenticated } = require('../../middleware/auth')

router.get('/test-token', authenticated, userController.testToken)
router.post('/register', userController.register)
router.post('/login', userController.logIn)

module.exports = router
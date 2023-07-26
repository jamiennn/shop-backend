const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User, Order, OrderItem, Product } = require('../models')
const { Op } = require('sequelize')

const { errorToFront } = require('../middleware/error-handler')

const {
  registerValidate,
  notEmptyChain,
  checkValidationResult
} = require('../middleware/validator')
const preCheckHelper = require('../helpers/pre-check-helper')


const userController = {
  register: [
    registerValidate,
    async (req, res, next) => {
      try {
        checkValidationResult(req)

        const { account, email, password, isSeller } = req.body
        const user = await User.findAll({
          where: {
            [Op.or]: [{ account }, { email }]
          }
        })
        if (user.length > 0) throw new errorToFront('Email or account has been taken, try another')

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        let createdUser = await User.create({ account, email, password: hash, isSeller })
        createdUser = createdUser.toJSON()
        delete createdUser.password

        res.status(200).json({
          status: 'success',
          data: { user: createdUser }
        })
      } catch (e) { next(e) }
    }
  ],
  logIn: [
    notEmptyChain(['account', 'password']),
    async (req, res, next) => {
      try {
        checkValidationResult(req)

        const { account, password } = req.body
        const user = await User.findOne({
          where: { account },
          raw: true
        })
        if (!user) throw new errorToFront('Incorrect account or password')

        const success = await bcrypt.compare(password, user.password)
        if (!success) throw new errorToFront('Incorrect account or password')

        delete user.password
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.status(200).json({
          status: 'success',
          data: {
            token,
            loginUser: user
          }
        })

      } catch (error) {
        next(error)
      }
    }
  ],
  testToken: (req, res) => {
    const userData = req.user.toJSON()
    delete userData.password

    res.status(200).json({
      status: 'success',
      data: {
        loginUser: userData
      }
    })
  },
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.uid
      const user = await User.findOne({
        where: { id: userId },
        raw: true
      })
      preCheckHelper.isFound(user)
      delete user.password
      res.json({
        status: 'success',
        messages: { user }
      })
    } catch (e) {
      next(e)
    }
  },
  getUserOrders: async (req, res, next) => {
    try {
      const userId = Number(req.params.uid)
      const loginUserId = req.user.id
      preCheckHelper.userAuth(userId, loginUserId)

      const order = await Order.findAll({
        where: { userId },
        include: {
          model: OrderItem,
          include: {
            model: Product,
            required: true
          },
          required: true
        }
      })
      preCheckHelper.isFound(order)

      res.json({
        status: 'success',
        data: { order }
      })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = userController
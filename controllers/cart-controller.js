const { Op } = require('sequelize')
const { User, Product, Category, CartItem, sequelize, Order, OrderItem } = require('../models')
const { errorToFront } = require('../middleware/error-handler')
const { notEmptyChain, checkAmount, checkValidationResult } = require('../middleware/validator')
const preCheckHelper = require('../helpers/pre-check-helper')


const cartController = {
  getCartItems: async (req, res, next) => {
    try {
      const loginUserId = req.user.id
      const user = await User.findByPk(loginUserId, { raw: true })

      preCheckHelper.isBuyer(!user || user.isSeller)

      const cartItems = await CartItem.findAll({
        where: { userId: loginUserId, isOrdered: false },
        include: [{
          model: Product,
          where: {
            stock: { [Op.gt]: 0 },
            onShelf: true
          },
          required: true
        }],
        raw: true,
        nest: true
      })
      res.json({
        status: 'success',
        data: { cartItems }
      })
    } catch (e) { next(e) }
  },
  postCartItem: [
    notEmptyChain(['productId', 'amount']),
    checkAmount(),
    async (req, res, next) => {
      try {
        checkValidationResult(req)

        const loginUserId = req.user.id
        const { productId, amount } = req.body

        const [user, product, cartItem] = await Promise.all([
          User.findByPk(loginUserId, { raw: true }),
          Product.findByPk(productId, {
            where: { onShelf: true },
            raw: true
          }),
          CartItem.findOne({
            where: { productId, userId: loginUserId, isOrdered: false }
          })
        ])

        preCheckHelper.isBuyer(!user || user.isSeller)
        preCheckHelper.isFound(product, 'Product')
        preCheckHelper.checkStock(product.name, product.stock, amount)

        let newCartItem

        if (cartItem) {
          const newAmount = Number(amount) + cartItem.amount
          preCheckHelper.checkStock(product.name, product.stock, newAmount)

          newCartItem = await cartItem.update({
            amount: newAmount
          })

        } else {
          newCartItem = await CartItem.create({
            userId: loginUserId,
            productId,
            amount
          })
        }
        res.json({
          status: 'success',
          data: { newCartItem }
        })
      } catch (e) {
        next(e)
      }
    }
  ],
  putCartItem: [
    notEmptyChain(['amount']),
    checkAmount(),
    async (req, res, next) => {
      try {
        checkValidationResult(req)

        const loginUserId = req.user.id
        const { amount } = req.body
        const cartId = req.params.cid

        const cartItem = await CartItem.findByPk(cartId, {
          where: { isOrdered: false },
          include: [{
            model: Product,
            where: {
              stock: { [Op.gt]: 0 },
              onShelf: true
            },
            required: true
          }],
        })

        preCheckHelper.isFound(cartItem, 'Cart item')
        preCheckHelper.userAuth(cartItem.userId, loginUserId)
        preCheckHelper.checkStock(cartItem.Product.name, cartItem.Product.stock, amount)

        const newCartItem = await cartItem.update({
          amount: Number(amount)
        })

        res.json({
          status: 'success',
          data: { newCartItem }
        })
      } catch (e) {
        next(e)
      }
    }
  ],
  deleteCartItem: async (req, res, next) => {
    try {

      const loginUserId = req.user.id
      const cartId = req.params.cid
      const cartItem = await CartItem.findByPk(cartId)

      preCheckHelper.isFound(cartItem, 'Cart item')
      preCheckHelper.userAuth(cartItem.userId, loginUserId)

      await cartItem.destroy()

      res.json({
        status: 'success',
        data: { deletedItem: cartItem }
      })
    } catch (e) {
      next(e)
    }
  },
  checkoutCart: async (req, res, next) => {
    try {
      const loginUserId = req.user.id

      // 確認要下單的 user 身份
      const user = await User.findByPk(loginUserId, { raw: true })
      preCheckHelper.isBuyer(!user || user.isSeller)

      // 找出他的購物車
      const cartItems = await CartItem.findAll({
        where: { userId: loginUserId, isOrdered: false },
        include: [{
          model: Product,
          where: {
            stock: { [Op.gt]: 0 },
            onShelf: true
          },
          required: true
        }],
        raw: true,
        nest: true
      })

      if (!cartItems.length) {
        return res.json({
          status: 'error',
          message: 'User have no cart items'
        })
      }

      // 確認有足夠庫存
      cartItems.forEach(c => {
        preCheckHelper.checkStock(c.Product.name, c.Product.stock, c.amount)
      })

      // 開始下單流程
      const transacResult = await sequelize.transaction(async (t) => {

        // 建立訂單
        const newOrder = await Order.create({ userId: loginUserId }, { transaction: t })

        // 先準備訂單的每一筆資料
        const cartList = cartItems.map(c => ({
          orderId: newOrder.id,
          productId: c.productId,
          amount: c.amount
        }))

        // 建立訂單的每一筆資料
        const orderItems = await OrderItem.bulkCreate(cartList, { transaction: t })

        // 購物車關閉
        await CartItem.update({
          isOrdered: true
        }, { where: { userId: loginUserId } }, { transaction: t })

        return {
          order: newOrder,
          orderItems
        }
      })

      res.json({
        status: 'success',
        data: transacResult
      })
    } catch (e) { next(e) }
  }
}

module.exports = cartController
const { Op } = require('sequelize')
const { User, Product, Category, CartItem } = require('../models')
const { errorToFront } = require('../middleware/error-handler')
const { notEmptyChain, checkValidationResult } = require('../middleware/validator')


const cartController = {
  getCartItems: async (req, res, next) => {
    try {
      const userId = Number(req.params.uid)
      const loginUserId = req.user.id

      if (userId !== loginUserId) throw new errorToFront('Forbidden')

      const user = await User.findByPk(userId, { raw: true })
      if (!user || user.isSeller) throw new errorToFront('Forbidden')

      const cartItems = await CartItem.findAll({
        where: { userId, isOrdered: false },
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
        if (!user || user.isSeller) throw new errorToFront('Forbidden')
        if (!product) throw new errorToFront('Product doesn\'t exist')
        if (product.stock < amount) throw new errorToFront(`There\'s only ${product.stock} left, please check the amount again`)

        let newCartItem

        if (cartItem) {
          const newAmount = Number(amount) + cartItem.amount

          if (product.stock < newAmount) throw new errorToFront(`There\'s only ${product.stock} left, please check the amount again`)

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

        if (!cartItem) throw new errorToFront('Cart not found, this could be caused by the seller pulling products from the shelf')
        if (cartItem.userId !== loginUserId) throw new errorToFront('Forbidden')
        if (cartItem.Product.stock < amount) throw new errorToFront(`There\'s only ${cartItem.Product.stock} left, please check the amount again`)

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

      if (cartItem.userId !== loginUserId) throw new errorToFront('Forbidden')

      await cartItem.destroy()

      res.json({
        status: 'success',
        data: { deletedItem: cartItem }
      })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = cartController
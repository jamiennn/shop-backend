const { Op } = require('sequelize')
const { User, Order, OrderItem, Product, sequelize } = require('../models')
const { errorToFront } = require('../middleware/error-handler')
const preCheckHelper = require('../helpers/pre-check-helper')
const { notEmptyChain, checkAmount, checkValidationResult } = require('../middleware/validator')

const orderController = {
  getOrder: async (req, res, next) => {
    try {
      const orderId = Number(req.params.oid)
      const loginUserId = req.user.id

      const order = await Order.findByPk(orderId, {
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
      preCheckHelper.userAuth(order.userId, loginUserId)

      res.json({
        status: 'success',
        data: { order }
      })
    } catch (e) { next(e) }
  },
  putOrderItem: [
    notEmptyChain(['amount']),
    checkAmount(),
    async (req, res, next) => {
      try {
        checkValidationResult(req)

        const loginUserId = req.user.id
        const { amount } = req.body
        const orderItemId = req.params.orderItemId

        const orderItem = await OrderItem.findByPk(orderItemId, {
          include: [{
            model: Product,
            where: {
              stock: { [Op.gt]: 0 },
              onShelf: true
            },
            required: true
          }, {
            model: Order,
            where: { isChecked: false },
            required: true
          }],
        })

        preCheckHelper.isFound(orderItem, 'Order item')
        preCheckHelper.userAuth(orderItem.Order.userId, loginUserId)
        preCheckHelper.checkStock(orderItem.Product.name, orderItem.Product.stock, amount)

        const newOrderItem = await orderItem.update({
          amount: Number(amount)
        })

        res.json({
          status: 'success',
          data: { newOrderItem }
        })
      } catch (e) {
        next(e)
      }
    }
  ],
  deleteOrderItem: async (req, res, next) => {
    try {

      const loginUserId = req.user.id
      const orderItemId = req.params.orderItemId
      const orderItem = await OrderItem.findByPk(orderItemId, {
        include: {
          model: Order,
          where: { isChecked: false },
        }
      })

      preCheckHelper.isFound(orderItem, 'Order item')
      preCheckHelper.userAuth(orderItem.Order.userId, loginUserId)

      await orderItem.destroy()

      res.json({
        status: 'success',
        data: { deletedItem: orderItem }
      })
    } catch (e) {
      next(e)
    }
  },
  checkOutOrder: async (req, res, next) => {
    try {
      const orderId = Number(req.params.oid)
      const loginUserId = req.user.id

      // 先找到該筆訂單
      const order = await Order.findOne({
        where: { id: orderId, isChecked: false },
        include: [{
          model: OrderItem,
          include: {
            model: Product,
            required: true
          },
          required: true
        }, {
          model: User,
          required: true
        }]
      })

      // 確認 order 存在、確認要下單的 user 身份
      preCheckHelper.isFound(order, 'Order')
      preCheckHelper.userAuth(order.userId, loginUserId)

      // 確認商品有上架、庫存足夠
      const orderItems = order.OrderItems
      for (let i of orderItems) {
        preCheckHelper.isOnShelf(i.Product.name, i.Product.onShelf)
        preCheckHelper.checkStock(i.Product.name, i.Product.stock, i.amount)
      }



      ////// 開始下單流程 //////

      // update product：stock 扣除購買數量，version + 1。update 時要附帶 where 查詢條件 version
      const t = await sequelize.transaction()
      const newProducts = await Promise.all(
        orderItems.map(async i => {
          const product = i.Product
          const newProduct = await Product.update({
            stock: product.stock - i.amount,
            version: product.version + 1
          }, {
            where: { id: product.id, version: product.version, onShelf: true },
            transaction: t
          })
          return newProduct[0]
        })
      )

      // 將 product 當下的 name, price, image 存進 orderitem
      const newOrderItems = await Promise.all(
        orderItems.map(async i => {
          const product = i.Product
          const newOrderItem = await OrderItem.update({
            productName: product.name,
            productImage: product.image,
            productPrice: product.price
          }, {
            where: { id: i.id },
            transaction: t
          })
          return newOrderItem[0]
        })
      )

      // 訂單完成：isChecked = true
      const newOrder = await Order.update({
        isChecked: true
      }, {
        where: { id: orderId },
        transaction: t
      })

      // 如果依照 version 找不到資料，代表同一時間有人改過，就 rollback transaction
      if (!newOrder[0] || newProducts.includes(0) || newOrderItems.includes(0)) {
        await t.rollback()
        return res.status(500).json({ message: 'Transaction failed' })
      }

      await t.commit()
      res.status(200).json({ message: 'success' })

    } catch (e) {
      next(e)
    }
  }
}

module.exports = orderController
const { Order, OrderItem, Product } = require('../models')
const { errorToFront } = require('../middleware/error-handler')
const preCheckHelper = require('../helpers/pre-check-helper')

const orderController = {
  getOrder: async (req, res, next) => {
    try {
      const orderId = Number(req.params.oid)
      const loginUserId = req.user.id

      let order = await Order.findByPk(orderId, {
        include: {
          model: OrderItem,
          include: {
            model: Product,
            required: true
          }
        }
      })
      // order = order.toJSON()
      preCheckHelper.isFound(order)
      preCheckHelper.userAuth(order.userId, loginUserId)


      // if (!order.isChecked) {
      //   for (let i of order.OrderItems) {
      //     if (!i.Product.onShelf) throw new errorToFront(`${i.Product.name} has been removed from the shelf, please delete if from order`)
      //     if (i.Product.stock < i.amount) throw new errorToFront(`${i.Product.name} has only ${i.Product.stock} left, please check the amount again`)
      //   }
      // }
      res.json({
        status: 'success',
        data: { order }
      })
    } catch (e) { next(e) }
  },

}

module.exports = orderController
const { User, Product, Category, sequelize } = require('../models')
const { Op, literal } = require('sequelize')
const { errorToFront } = require('../middleware/error-handler')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')
const getQueryString = require('../helpers/query-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const preCheckHelper = require('../helpers/pre-check-helper')


const {
  notEmptyChain,
  productValidate,
  checkValidationResult
} = require('../middleware/validator')

const productController = {
  getProducts: async (req, res, next) => {
    try {
      let { queryText, priceMax, priceMin, categoryIdArray, page, limit, shopId, offset } = getQueryString(req)

      const user = await User.findByPk(shopId)
      if (!user.isSeller) throw new errorToFront('Invalid seller id')

      const [products, categories] = await Promise.all([
        Product.findAndCountAll({
          where: {
            name: literal(queryText),
            price: {
              [Op.between]: [priceMin, priceMax],
            },
            ...categoryIdArray ? { categoryId: { [Op.or]: categoryIdArray } } : {},
            userId: shopId,
            onShelf: true
          },
          attributes: ['id', 'userId', 'name', 'price', 'image'],
          limit,
          offset,
          raw: true,
          nest: true,
          order: [['price', 'asc']]
        }),
        Category.findAll({ raw: true })
      ])
      res.json({
        status: 'success',
        data: {
          products: products.rows,
          categories,
          pagination: getPagination(limit, page, products.count)
        }
      })
    } catch (e) {
      next(e)
    }
  },
  getProduct: async (req, res, next) => {
    try {

      const id = req.params.pid
      const product = await Product.findByPk(id, {
        include: [User, Category],
        where: { onShelf: true },
        raw: true,
        nest: true
      })

      preCheckHelper.isFound(product)

      res.json({ status: 'success', data: { product } })
    } catch (e) {
      next(e)
    }
  },
  postProduct: [
    productValidate,
    async (req, res, next) => {
      try {
        checkValidationResult(req)

        const loginUserId = req.user.id
        const { name, price, description, stock, categoryId } = req.body
        const file = req.file

        const [user, category] = await Promise.all([
          User.findByPk(loginUserId, { raw: true }),
          Category.findByPk(categoryId)
        ])

        if (!user || !user.isSeller) throw new errorToFront('Forbidden')

        preCheckHelper.isFound(category, 'Category')

        const imagePath = await imgurFileHandler(file)
        const product = await Product.create({
          userId: loginUserId, name, price, description,
          image: imagePath, stock, categoryId,
          onShelf: true,
          version: 0
        })

        res.json({
          status: 'success',
          data: { product }
        })
      } catch (e) {
        next(e)
      }
    }
  ],
  putProduct: [
    productValidate,
    async (req, res, next) => {
      try {
        checkValidationResult(req)

        const loginUserId = req.user.id
        const productId = req.params.pid
        const { name, price, description, stock, categoryId } = req.body
        const file = req.file

        const [category, product] = await Promise.all([
          Category.findByPk(categoryId),
          Product.findByPk(productId, { where: { onShelf: true } })
        ])

        preCheckHelper.isFound(product, 'Product')
        preCheckHelper.userAuth(product.userId, loginUserId)
        preCheckHelper.isFound(category, 'Category')

        const imagePath = await imgurFileHandler(file)
        const editedProduct = await Product.update({
          name, price, description,
          image: imagePath || product.image,
          stock, categoryId,
          onShelf: true,
          version: product.version + 1
        }, { where: { id: product.id, version: product.version } })

        let status = 'Success'
        if (!editedProduct[0]) status = 'Update failed'

        res.json({
          status,
        })
      } catch (e) {
        next(e)
      }
    }
  ],
  patchProduct:
    async (req, res, next) => {
      try {
        const loginUserId = req.user.id
        const productId = req.params.pid

        const product = await Product.findByPk(productId)

        preCheckHelper.isFound(product, 'Product')
        preCheckHelper.userAuth(product.userId, loginUserId)

        const pulledProduct = await Product.update({
          ...product,
          onShelf: 0,
          version: product.version + 1
        }, { where: { id: product.id, version: product.version } })

        let status
        if (pulledProduct[0] === 0) status = 'Update failed'
        if (pulledProduct[0] === 1) status = 'Success'
        res.json({
          status,
        })
      } catch (e) {
        next(e)
      }
    }
}

module.exports = productController
const { User, Product, Category } = require('../models')
const { Op, literal } = require('sequelize')

const { errorToFront } = require('../middleware/error-handler')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

const {
  notEmptyChain,
  checkValidationResult
} = require('../middleware/validator')
const { error } = require('console')

const productController = {
  getProducts: async (req, res, next) => {
    try {
      const DEFAUL_LIMIT = 25
      const DEFAULT_MAX_PRICE = 10000

      const keyword = req.query.keyword?.trim()?.toLowerCase() || null
      const priceMax = Number(req.query.priceMax) || DEFAULT_MAX_PRICE
      const priceMin = Number(req.query.priceMin) || 0

      // 處理複選 categoryId的狀況
      const categoryId = req.query.categoryId
      const categoryIdArray = categoryId ? Array.isArray(categoryId) ? categoryId : [Number(categoryId)] : ''

      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAUL_LIMIT
      const shopId = Number(req.query.shopId) || ''
      const offset = getOffset(limit, page)

      const queryText = keyword ? `Product.name LIKE '%${keyword.replace(/['"]+/g, '')}%'` : ''


      const [products, categories] = await Promise.all([
        Product.findAndCountAll({
          where: {
            name: literal(queryText),
            price: {
              [Op.between]: [priceMin, priceMax],
            },
            ...categoryIdArray ? { categoryId: { [Op.or]: categoryIdArray } } : {},
            ...shopId ? { shopId } : {},
            onShelf: true
          },
          attributes: ['id', 'userId', 'name', 'price', 'image'],
          limit,
          offset,
          raw: true,
          nest: true,
          order: [['price', 'desc']]
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
        raw: true,
        nest: true
      })

      if (!product) throw new errorToFront('Product does\'nt exist')

      res.json({ status: 'success', data: { product } })
    } catch (e) {
      next(e)
    }
  },
  postProduct: async (req, res, next) => {
    try {

    } catch (e) {
      next(e)
    }
  }

}

module.exports = productController
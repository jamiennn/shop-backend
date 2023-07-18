const { User, Product, Category } = require('../models')
const { Op, literal } = require('sequelize')
const { errorToFront } = require('../middleware/error-handler')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const {
  notEmptyChain,
  productValidate,
  checkValidationResult
} = require('../middleware/validator')
// const { error } = require('console')

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

        if (!user || !user.isSeller) throw new errorToFront('User doesn\'t exist or have no authority to create products')
        if (!category) throw new errorToFront('Category doesn\'t exist')

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
          Product.findByPk(productId)
        ])

        if (!product) throw new errorToFront('Product doesn\'t exist')
        if (product.userId !== loginUserId) throw new errorToFront('Have no authority to edit products')
        if (!category) throw new errorToFront('Category doesn\'t exist')

        const imagePath = await imgurFileHandler(file)
        const editedProduct = await product.update({
          name, price, description,
          image: imagePath || product.image,
          stock, categoryId,
          onShelf: true,
          version: product.version + 1
        })

        res.json({
          status: 'success',
          data: { editedProduct }
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

        if (!product) throw new errorToFront('Product doesn\'t exist')
        if (product.userId !== loginUserId) throw new errorToFront('Have no authority to edit products')

        const pulledProduct = await product.update({
          ...product,
          onShelf: 0,
          version: product.version + 1
        })

        res.json({
          status: 'success',
          data: { pulledProduct }
        })
      } catch (e) {
        next(e)
      }
    }
}

module.exports = productController
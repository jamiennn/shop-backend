const { getOffset } = require('../helpers/pagination-helpers')

const getQueryString = (req) => {
  const DEFAUL_LIMIT = 18
  const DEFAULT_MAX_PRICE = 50000
  const DEFAULT_ORDER = ['createdAt', 'desc']

  const keyword = req.query.keyword?.trim()?.toLowerCase() || null
  const priceMax = Number(req.query.priceMax) || DEFAULT_MAX_PRICE
  const priceMin = Number(req.query.priceMin) || 0
  const order = req.query.order || DEFAULT_ORDER

  // 處理複選 categoryId的狀況
  const categoryId = req.query.categoryId
  const categoryIdArray = categoryId ? Array.isArray(categoryId) ? categoryId : [Number(categoryId)] : ''

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || DEFAUL_LIMIT
  const shopId = Number(req.query.shopId) || ''
  const offset = getOffset(limit, page)

  const queryText = keyword ? `Product.name LIKE '%${keyword.replace(/['"]+/g, '')}%'` : ''

  return { priceMax, priceMin, order, categoryIdArray, page, limit, shopId, offset, queryText }
}

module.exports = getQueryString
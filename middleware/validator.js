const { body, validationResult } = require('express-validator')
const { errorToFront } = require('./error-handler')

const ACCOUNT_LENGTH = 10
const PRODUCT_NAME_LENGTH = 50
const PRICE_MAX = 50000
const PRODUCT_DESCRIPTION_LENGTH = 10000
const STOCK_MAX = 999999
const DEFAULT_MAX_AMMOUNT = 999999


const notEmptyChain = (sth) => {
  return body(sth).trim().notEmpty().withMessage('Please filled required fields')
}

const lengthChain = (sth, min, max) => {
  return body(sth).trim().isLength({ min, max }).withMessage(`Invalid length of ${sth}`)
}
const checkEmailChain = () => {
  return body('email').trim().isEmail().withMessage('Invalid email address')
}
const passwordLength = (sth) => {
  return body(sth).trim().isLength({ min: 7, max: 30 }).withMessage('Passwords\' length have to be 7 ~ 30 characters')
}

const checkPassword = () => body(['checkPassword']).trim().custom((value, { req }) => {
  if (value !== req.body.password) return false
  return true
}).withMessage('Password and check password must be the same')

const checkBoolean = (sth) => {
  return body(sth).trim().isBoolean().withMessage('The seller field is restricted to true or false.')
}

const checkMinMax = (sth, min, max) => {
  return body(sth).isInt({ min, max }).withMessage(`Invalid value of ${sth}`)
}


const validator = {
  notEmptyChain,
  checkAmount: () => checkMinMax('amount', 1, DEFAULT_MAX_AMMOUNT),
  registerValidate: [
    notEmptyChain(['account', 'email', 'password', 'checkPassword', 'isSeller']),
    checkEmailChain(),
    lengthChain('account', 1, ACCOUNT_LENGTH),
    passwordLength('password'),
    checkPassword(),
    checkBoolean('isSeller'),
  ],
  productValidate: [
    notEmptyChain(['name', 'price', 'stock', 'categoryId']),
    lengthChain('name', 1, PRODUCT_NAME_LENGTH),
    checkMinMax('price', 1, PRICE_MAX),
    lengthChain('description', 0, PRODUCT_DESCRIPTION_LENGTH),
    checkMinMax('stock', 1, STOCK_MAX),
  ],
  checkValidationResult: (req) => {
    const result = validationResult.withDefaults({
      formatter: error => error.msg
    })
    const errors = result(req).array()
    if (errors.length > 0) throw new errorToFront(JSON.stringify(errors))
  }
}

module.exports = validator
const { body, validationResult } = require('express-validator')
const { errorToFront } = require('./error-handler')


const notEmptyChain = (sth) => {
  return body(sth).trim().notEmpty().withMessage('Please filled required fields')
}

const lengthChain = (sth) => {
  return body(sth).trim().isLength({ max: 10 }).withMessage('Account name is limited to 10 characters.')
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


const validator = {
  notEmptyChain,
  registerValidate: [
    notEmptyChain(['account', 'email', 'password', 'checkPassword', 'isSeller']),
    checkEmailChain(),
    lengthChain('account'),
    passwordLength('password'),
    checkPassword(),
    checkBoolean('isSeller'),
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
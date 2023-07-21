const { errorToFront } = require('../middleware/error-handler')

const preCheckHelper = {
  isBuyer: (params) => {
    if (params) throw new errorToFront('Forbidden1')
  },
  userAuth: (userId1, userId2) => {
    if (userId1 !== userId2) throw new errorToFront('Forbidden2')
  },
  isFound: (item) => {
    if (!item) throw new errorToFront(`Item not found`)
  },
  checkStock: (name, supply, demand) => {
    if (supply < demand) throw new errorToFront(`${name} has only ${supply} left, please check the amount again`)
  }
}

module.exports = preCheckHelper
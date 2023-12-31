const { errorToFront } = require('../middleware/error-handler')

const preCheckHelper = {
  isBuyer: (params) => {
    if (params) throw new errorToFront('Forbidden')
  },
  userAuth: (userId1, userId2) => {
    if (userId1 !== userId2) throw new errorToFront('Forbidden')
  },
  isFound: (item, itemName) => {
    if (!item) throw new errorToFront(`${itemName} not found`)
  },
  checkStock: (name, supply, demand) => {
    if (supply < demand) throw new errorToFront(`${name} has only ${supply} left, please check the amount again`)
  },
  isOnShelf: (name, isOnshelf) => {
    if (!isOnshelf) throw new errorToFront(`${name} has been removed from the shelf, please delete if from order`)
  }
}

module.exports = preCheckHelper
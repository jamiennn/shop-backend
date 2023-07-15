'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.CartItem, { foreignKey: 'productId' })
      Product.hasMany(models.OrderItem, { foreignKey: 'productId' })
      Product.belongsTo(models.User, { foreignKey: 'userId' })
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' })
    }
  }
  Product.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    onShelf: DataTypes.BOOLEAN,
    version: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    underscored: true
  });
  return Product;
};
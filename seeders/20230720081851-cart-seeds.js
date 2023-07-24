'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users, products] = await Promise.all([
      queryInterface.sequelize.query(
        `SELECT id FROM Users WHERE is_seller = 0;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
      queryInterface.sequelize.query(
        `SELECT id FROM Products WHERE on_shelf = 1`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])

    await queryInterface.bulkInsert('CartItems',
      Array.from({ length: 15 }, (_, i) => ({
        user_id: users[Math.floor(Math.random() * users.length)].id,
        product_id: products[Math.floor(Math.random() * products.length)].id,
        amount: 1,
        is_ordered: false,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CartItems', {});
  }
};

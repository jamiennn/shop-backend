'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users, categories] = await Promise.all([
      queryInterface.sequelize.query(
        'SELECT id FROM Users WHERE `is_seller` = 1;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
      queryInterface.sequelize.query(
        'SELECT id FROM Categories;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 50 }, (_, i) => ({
        user_id: users[Math.floor(Math.random() * users.length)].id,
        name: `product${i}`,
        price: (Math.floor(Math.random() * 20) + 1) * 100,
        description: faker.lorem.paragraph({ min: 1, max: 3 }),
        image: `https://loremflickr.com/320/240/product/?lock=${Math.random() * 100}`,
        stock: Math.floor(Math.random() * 20) + 1,
        category_id: categories[Math.floor(Math.random() * categories.length)].id,
        on_shelf: true,
        version: 0,
        created_at: new Date(Date.now() - i * 60000).toISOString().substring(0, 16),
        updated_at: new Date(Date.now() - i * 60000).toISOString().substring(0, 16)
      }))
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', {})
  }
};

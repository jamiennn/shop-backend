'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 10 }, (_, i) => (
        i % 2 === 0 ? {
          is_seller: false,
          account: `buyer000${i}`,
          email: `buyer000${i}@email.com`,
          password: 'titaner',
          avatar: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 50) + 1}.jpg`,
          created_at: new Date(),
          updated_at: new Date(),
        } : {
          is_seller: true,
          account: `seller000${i}`,
          email: `seller000${i}@email.com`,
          password: 'titaner',
          avatar: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 50) + 1}.jpg`,
          created_at: new Date(),
          updated_at: new Date(),
        }
      ))
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
  }
};

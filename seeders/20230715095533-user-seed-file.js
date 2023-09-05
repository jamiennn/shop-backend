'use strict';
const bcrypt = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    async function genHash(password) {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      return hash
    }
    const password = await genHash('12345678')

    await queryInterface.bulkInsert('Users',
      Array.from({ length: 10 }, (_, i) => (
        i % 2 === 0 ? {
          is_seller: false,
          account: `buyer00${i}`,
          email: `buyer00${i}@email.com`,
          password,
          avatar: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 50) + 1}.jpg`,
          created_at: new Date(),
          updated_at: new Date(),
        } : {
          is_seller: true,
          account: `seller00${i}`,
          email: `seller00${i}@email.com`,
          password,
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

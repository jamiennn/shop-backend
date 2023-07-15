'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories',
      ['電子產品', '軟體', '家電', '生活居家', '工具', '汽機車', '運動', '娛樂', '書籍', '食物', '嬰幼兒', '日用', '女生衣服', '男生衣服', '美妝／保養／保健', '旅行']
        .map(item => {
          return {
            name: item,
            created_at: new Date(),
            updated_at: new Date()
          }
        }
        ), {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {})
  }
};

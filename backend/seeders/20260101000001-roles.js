'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('roles', [
      { name: 'SUPER_ADMIN', created_at: new Date(), updated_at: new Date() },
      { name: 'ADMIN', created_at: new Date(), updated_at: new Date() },
      { name: 'STAFF', created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};

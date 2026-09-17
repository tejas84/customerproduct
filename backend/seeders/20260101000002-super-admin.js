'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [roles] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'SUPER_ADMIN' LIMIT 1"
    );
    const roleId = roles[0].id;
    const passwordHash = await bcrypt.hash('Admin@12345', 12);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Development Super Admin',
        email: 'admin@example.com',
        password_hash: passwordHash,
        role_id: roleId,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('settings', [
      {
        setting_key: 'public_enquiry_url',
        setting_value: process.env.FRONTEND_URL
          ? `${process.env.FRONTEND_URL}/enquiry?source=qr`
          : 'http://localhost:5173/enquiry?source=qr',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' });
    await queryInterface.bulkDelete('settings', { setting_key: 'public_enquiry_url' });
  },
};

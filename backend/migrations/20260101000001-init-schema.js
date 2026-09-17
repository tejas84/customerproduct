'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(160), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      role_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('users', ['role_id']);
    await queryInterface.addIndex('users', ['is_active']);

    await queryInterface.createTable('customers', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      customer_name: { type: Sequelize.STRING(160), allowNull: false },
      mobile: { type: Sequelize.STRING(15), allowNull: false },
      email: { type: Sequelize.STRING(160), allowNull: true },
      address: { type: Sequelize.STRING(500), allowNull: true },
      city: { type: Sequelize.STRING(100), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('customers', ['mobile']);
    await queryInterface.addIndex('customers', ['email']);
    await queryInterface.addIndex('customers', ['customer_name']);

    await queryInterface.createTable('enquiry_counters', {
      year: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true },
      last_value: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    });

    await queryInterface.createTable('enquiries', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      enquiry_number: { type: Sequelize.STRING(32), allowNull: false, unique: true },
      customer_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'customers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      enquiry_type: { type: Sequelize.STRING(80), allowNull: false },
      product_service: { type: Sequelize.STRING(120), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      preferred_contact_method: { type: Sequelize.STRING(20), allowNull: true },
      status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'NEW' },
      source: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'WEBSITE' },
      assigned_to: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('enquiries', ['customer_id']);
    await queryInterface.addIndex('enquiries', ['status']);
    await queryInterface.addIndex('enquiries', ['enquiry_type']);
    await queryInterface.addIndex('enquiries', ['product_service']);
    await queryInterface.addIndex('enquiries', ['assigned_to']);
    await queryInterface.addIndex('enquiries', ['source']);
    await queryInterface.addIndex('enquiries', ['created_at']);

    await queryInterface.createTable('enquiry_status_history', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      enquiry_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'enquiries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      old_status: { type: Sequelize.STRING(30), allowNull: true },
      new_status: { type: Sequelize.STRING(30), allowNull: false },
      changed_by: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      remark: { type: Sequelize.STRING(500), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('enquiry_status_history', ['enquiry_id']);

    await queryInterface.createTable('followups', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      enquiry_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'enquiries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      assigned_to: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      followup_date: { type: Sequelize.DATEONLY, allowNull: false },
      followup_time: { type: Sequelize.TIME, allowNull: false },
      remark: { type: Sequelize.STRING(500), allowNull: true },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'PENDING' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('followups', ['enquiry_id']);
    await queryInterface.addIndex('followups', ['assigned_to']);
    await queryInterface.addIndex('followups', ['followup_date']);
    await queryInterface.addIndex('followups', ['status']);

    await queryInterface.createTable('enquiry_confirmations', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      enquiry_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'enquiries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      confirmation_number: { type: Sequelize.STRING(40), allowNull: false, unique: true },
      file_path: { type: Sequelize.STRING(500), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('enquiry_confirmations', ['enquiry_id']);

    await queryInterface.createTable('whatsapp_messages', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      enquiry_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'enquiries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      mobile: { type: Sequelize.STRING(15), allowNull: false },
      message_status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'PENDING' },
      provider_message_id: { type: Sequelize.STRING(120), allowNull: true },
      failure_reason: { type: Sequelize.STRING(500), allowNull: true },
      payload_preview: { type: Sequelize.STRING(500), allowNull: true },
      sent_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('whatsapp_messages', ['enquiry_id']);
    await queryInterface.addIndex('whatsapp_messages', ['message_status']);
    await queryInterface.addIndex('whatsapp_messages', ['mobile']);

    await queryInterface.createTable('audit_logs', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      action: { type: Sequelize.STRING(80), allowNull: false },
      entity_type: { type: Sequelize.STRING(80), allowNull: true },
      entity_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      old_value: { type: Sequelize.TEXT, allowNull: true },
      new_value: { type: Sequelize.TEXT, allowNull: true },
      ip_address: { type: Sequelize.STRING(64), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('audit_logs', ['user_id']);
    await queryInterface.addIndex('audit_logs', ['action']);
    await queryInterface.addIndex('audit_logs', ['entity_type', 'entity_id']);
    await queryInterface.addIndex('audit_logs', ['created_at']);

    await queryInterface.createTable('settings', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      setting_key: { type: Sequelize.STRING(80), allowNull: false, unique: true },
      setting_value: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('settings');
    await queryInterface.dropTable('audit_logs');
    await queryInterface.dropTable('whatsapp_messages');
    await queryInterface.dropTable('enquiry_confirmations');
    await queryInterface.dropTable('followups');
    await queryInterface.dropTable('enquiry_status_history');
    await queryInterface.dropTable('enquiries');
    await queryInterface.dropTable('enquiry_counters');
    await queryInterface.dropTable('customers');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('roles');
  },
};

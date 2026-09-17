const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Enquiry = sequelize.define(
    'Enquiry',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      enquiry_number: { type: DataTypes.STRING(32), allowNull: false, unique: true },
      customer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      enquiry_type: { type: DataTypes.STRING(80), allowNull: false },
      product_service: { type: DataTypes.STRING(120), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      preferred_contact_method: { type: DataTypes.STRING(20), allowNull: true },
      status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'NEW' },
      source: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'WEBSITE' },
      assigned_to: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    },
    { tableName: 'enquiries' }
  );
  return Enquiry;
};

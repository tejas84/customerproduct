const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EnquiryConfirmation = sequelize.define(
    'EnquiryConfirmation',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      enquiry_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      confirmation_number: { type: DataTypes.STRING(40), allowNull: false, unique: true },
      file_path: { type: DataTypes.STRING(500), allowNull: false },
    },
    { tableName: 'enquiry_confirmations', updatedAt: false }
  );
  return EnquiryConfirmation;
};

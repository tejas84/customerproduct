const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EnquiryCounter = sequelize.define(
    'EnquiryCounter',
    {
      year: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
      last_value: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    },
    { tableName: 'enquiry_counters', timestamps: false }
  );
  return EnquiryCounter;
};

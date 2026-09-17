const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EnquiryStatusHistory = sequelize.define(
    'EnquiryStatusHistory',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      enquiry_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      old_status: { type: DataTypes.STRING(30), allowNull: true },
      new_status: { type: DataTypes.STRING(30), allowNull: false },
      changed_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      remark: { type: DataTypes.STRING(500), allowNull: true },
    },
    { tableName: 'enquiry_status_history', updatedAt: false }
  );
  return EnquiryStatusHistory;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Followup = sequelize.define(
    'Followup',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      enquiry_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      assigned_to: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      followup_date: { type: DataTypes.DATEONLY, allowNull: false },
      followup_time: { type: DataTypes.TIME, allowNull: false },
      remark: { type: DataTypes.STRING(500), allowNull: true },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'PENDING' },
    },
    { tableName: 'followups' }
  );
  return Followup;
};

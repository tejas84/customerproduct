const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define(
    'AuditLog',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      action: { type: DataTypes.STRING(80), allowNull: false },
      entity_type: { type: DataTypes.STRING(80), allowNull: true },
      entity_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      old_value: { type: DataTypes.TEXT, allowNull: true },
      new_value: { type: DataTypes.TEXT, allowNull: true },
      ip_address: { type: DataTypes.STRING(64), allowNull: true },
    },
    { tableName: 'audit_logs', updatedAt: false }
  );
  return AuditLog;
};

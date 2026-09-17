const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Setting = sequelize.define(
    'Setting',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      setting_key: { type: DataTypes.STRING(80), allowNull: false, unique: true },
      setting_value: { type: DataTypes.TEXT, allowNull: true },
    },
    { tableName: 'settings' }
  );
  return Setting;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define(
    'Customer',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      customer_name: { type: DataTypes.STRING(160), allowNull: false },
      mobile: { type: DataTypes.STRING(15), allowNull: false },
      email: { type: DataTypes.STRING(160), allowNull: true },
      address: { type: DataTypes.STRING(500), allowNull: true },
      city: { type: DataTypes.STRING(100), allowNull: true },
    },
    { tableName: 'customers' }
  );
  return Customer;
};

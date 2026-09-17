const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WhatsappMessage = sequelize.define(
    'WhatsappMessage',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      enquiry_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      mobile: { type: DataTypes.STRING(15), allowNull: false },
      message_status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'PENDING' },
      provider_message_id: { type: DataTypes.STRING(120), allowNull: true },
      failure_reason: { type: DataTypes.STRING(500), allowNull: true },
      payload_preview: { type: DataTypes.STRING(500), allowNull: true },
      sent_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: 'whatsapp_messages' }
  );
  return WhatsappMessage;
};

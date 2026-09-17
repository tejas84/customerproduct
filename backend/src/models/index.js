const sequelize = require('../config/database');
const Role = require('./Role')(sequelize);
const User = require('./User')(sequelize);
const Customer = require('./Customer')(sequelize);
const Enquiry = require('./Enquiry')(sequelize);
const EnquiryStatusHistory = require('./EnquiryStatusHistory')(sequelize);
const Followup = require('./Followup')(sequelize);
const EnquiryConfirmation = require('./EnquiryConfirmation')(sequelize);
const WhatsappMessage = require('./WhatsappMessage')(sequelize);
const AuditLog = require('./AuditLog')(sequelize);
const EnquiryCounter = require('./EnquiryCounter')(sequelize);
const Setting = require('./Setting')(sequelize);

Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

Customer.hasMany(Enquiry, { foreignKey: 'customer_id', as: 'enquiries' });
Enquiry.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

User.hasMany(Enquiry, { foreignKey: 'assigned_to', as: 'assignedEnquiries' });
Enquiry.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

Enquiry.hasMany(EnquiryStatusHistory, { foreignKey: 'enquiry_id', as: 'statusHistory' });
EnquiryStatusHistory.belongsTo(Enquiry, { foreignKey: 'enquiry_id', as: 'enquiry' });
EnquiryStatusHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'changedByUser' });

Enquiry.hasMany(Followup, { foreignKey: 'enquiry_id', as: 'followups' });
Followup.belongsTo(Enquiry, { foreignKey: 'enquiry_id', as: 'enquiry' });
User.hasMany(Followup, { foreignKey: 'assigned_to', as: 'followups' });
Followup.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

Enquiry.hasMany(EnquiryConfirmation, { foreignKey: 'enquiry_id', as: 'confirmations' });
EnquiryConfirmation.belongsTo(Enquiry, { foreignKey: 'enquiry_id', as: 'enquiry' });

Enquiry.hasMany(WhatsappMessage, { foreignKey: 'enquiry_id', as: 'whatsappMessages' });
WhatsappMessage.belongsTo(Enquiry, { foreignKey: 'enquiry_id', as: 'enquiry' });

User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  Role,
  User,
  Customer,
  Enquiry,
  EnquiryStatusHistory,
  Followup,
  EnquiryConfirmation,
  WhatsappMessage,
  AuditLog,
  EnquiryCounter,
  Setting,
};

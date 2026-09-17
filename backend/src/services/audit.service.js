const { AuditLog } = require('../models');

function safeJson(value) {
  if (value == null) return null;
  try {
    const clone = JSON.parse(JSON.stringify(value));
    if (clone && typeof clone === 'object') {
      delete clone.password;
      delete clone.password_hash;
      delete clone.token;
    }
    return JSON.stringify(clone);
  } catch {
    return null;
  }
}

async function writeAudit({ userId, action, entityType, entityId, oldValue, newValue, ip }) {
  try {
    await AuditLog.create({
      user_id: userId || null,
      action,
      entity_type: entityType || null,
      entity_id: entityId || null,
      old_value: safeJson(oldValue),
      new_value: safeJson(newValue),
      ip_address: ip || null,
    });
  } catch (err) {
    console.error('Audit log write failed');
  }
}

module.exports = { writeAudit };

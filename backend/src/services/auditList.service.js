const { AuditLog, User } = require('../models');

async function listAuditLogs({ page = 1, limit = 25, action, search }) {
  const { Op } = require('sequelize');
  const where = {};
  if (action) where.action = action;
  if (search) {
    where[Op.or] = [
      { action: { [Op.like]: `%${search}%` } },
      { entity_type: { [Op.like]: `%${search}%` } },
    ];
  }
  const { rows, count } = await AuditLog.findAndCountAll({
    where,
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    order: [['created_at', 'DESC']],
    limit: Number(limit),
    offset: (Number(page) - 1) * Number(limit),
  });
  return { items: rows, total: count, page: Number(page), limit: Number(limit) };
}

module.exports = { listAuditLogs };

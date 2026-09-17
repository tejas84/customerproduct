const bcrypt = require('bcrypt');
const { User, Role } = require('../models');
const { NotFoundError, ConflictError } = require('../utils/errors');
const { writeAudit } = require('./audit.service');

async function listUsers() {
  return User.findAll({
    include: [{ model: Role, as: 'role' }],
    order: [['created_at', 'DESC']],
  });
}

async function createUser(payload, actor, ip) {
  const existing = await User.findOne({ where: { email: payload.email } });
  if (existing) throw new ConflictError('Email already in use');
  const role = await Role.findOne({ where: { name: payload.role } });
  const password_hash = await bcrypt.hash(payload.password, 12);
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password_hash,
    role_id: role.id,
    is_active: true,
  });
  await writeAudit({
    userId: actor.id,
    action: 'USER_CREATE',
    entityType: 'User',
    entityId: user.id,
    newValue: { email: user.email, role: payload.role },
    ip,
  });
  return User.findByPk(user.id, { include: [{ model: Role, as: 'role' }] });
}

async function updateUser(id, payload, actor, ip) {
  const user = await User.unscoped().findByPk(id);
  if (!user) throw new NotFoundError('User not found');
  const updates = {};
  if (payload.name) updates.name = payload.name;
  if (payload.email) updates.email = payload.email;
  if (payload.role) {
    const role = await Role.findOne({ where: { name: payload.role } });
    updates.role_id = role.id;
  }
  if (payload.password) updates.password_hash = await bcrypt.hash(payload.password, 12);
  await user.update(updates);
  await writeAudit({
    userId: actor.id,
    action: payload.password ? 'USER_PASSWORD_RESET' : 'USER_UPDATE',
    entityType: 'User',
    entityId: user.id,
    ip,
  });
  return User.findByPk(id, { include: [{ model: Role, as: 'role' }] });
}

async function setStatus(id, is_active, actor, ip) {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError('User not found');
  await user.update({ is_active });
  await writeAudit({
    userId: actor.id,
    action: is_active ? 'USER_ENABLE' : 'USER_DISABLE',
    entityType: 'User',
    entityId: user.id,
    ip,
  });
  return User.findByPk(id, { include: [{ model: Role, as: 'role' }] });
}

module.exports = { listUsers, createUser, updateUser, setStatus };

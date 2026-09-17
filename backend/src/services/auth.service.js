const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User, Role } = require('../models');
const { UnauthorizedError } = require('../utils/errors');
const { writeAudit } = require('./audit.service');

function signToken(user, roleName) {
  return jwt.sign(
    { sub: user.id, role: roleName, email: user.email },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

async function login({ email, password }, ip) {
  const user = await User.unscoped().findOne({
    where: { email },
    include: [{ model: Role, as: 'role' }],
  });
  if (!user || !user.is_active) {
    throw new UnauthorizedError('Invalid email or password');
  }
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new UnauthorizedError('Invalid email or password');

  const token = signToken(user, user.role.name);
  await writeAudit({
    userId: user.id,
    action: 'LOGIN',
    entityType: 'User',
    entityId: user.id,
    ip,
  });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    },
  };
}

async function me(userId) {
  const user = await User.findByPk(userId, { include: [{ model: Role, as: 'role' }] });
  if (!user) throw new UnauthorizedError();
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    is_active: user.is_active,
  };
}

module.exports = { login, me };

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User, Role } = require('../models');
const { UnauthorizedError } = require('../utils/errors');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new UnauthorizedError('Authentication required');

    let payload;
    try {
      payload = jwt.verify(token, env.jwt.secret);
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }

    const user = await User.findByPk(payload.sub, { include: [{ model: Role, as: 'role' }] });
    if (!user || !user.is_active) throw new UnauthorizedError('Account is inactive or not found');

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      role_id: user.role_id,
    };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authenticate };

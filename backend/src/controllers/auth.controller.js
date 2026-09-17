const authService = require('../services/auth.service');
const { parseOrThrow } = require('../utils/validate');
const { loginSchema } = require('../validators/auth.validator');
const { success } = require('../utils/response');
const { writeAudit } = require('../services/audit.service');

async function login(req, res, next) {
  try {
    const payload = parseOrThrow(loginSchema, req.body);
    const data = await authService.login(payload, req.ip);
    return success(res, 'Login successful', data);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const data = await authService.me(req.user.id);
    return success(res, 'Current user', data);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    await writeAudit({
      userId: req.user.id,
      action: 'LOGOUT',
      entityType: 'User',
      entityId: req.user.id,
      ip: req.ip,
    });
    return success(res, 'Logged out');
  } catch (err) {
    next(err);
  }
}

module.exports = { login, me, logout };

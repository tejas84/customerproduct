const userService = require('../services/user.service');
const { parseOrThrow } = require('../utils/validate');
const { createUserSchema, updateUserSchema, userStatusSchema } = require('../validators/auth.validator');
const { success, created } = require('../utils/response');

async function list(req, res, next) {
  try {
    const data = await userService.listUsers();
    return success(res, 'Users fetched', data);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const payload = parseOrThrow(createUserSchema, req.body);
    const data = await userService.createUser(payload, req.user, req.ip);
    return created(res, 'User created', data);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const payload = parseOrThrow(updateUserSchema, req.body);
    const data = await userService.updateUser(req.params.id, payload, req.user, req.ip);
    return success(res, 'User updated', data);
  } catch (err) {
    next(err);
  }
}

async function status(req, res, next) {
  try {
    const payload = parseOrThrow(userStatusSchema, req.body);
    const data = await userService.setStatus(req.params.id, payload.is_active, req.user, req.ip);
    return success(res, 'User status updated', data);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, status };

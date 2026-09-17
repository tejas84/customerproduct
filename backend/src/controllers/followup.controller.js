const followupService = require('../services/followup.service');
const { parseOrThrow } = require('../utils/validate');
const { createFollowupSchema, updateFollowupSchema, followupStatusSchema } = require('../validators/followup.validator');
const { success, created } = require('../utils/response');

async function create(req, res, next) {
  try {
    const payload = parseOrThrow(createFollowupSchema, req.body);
    const data = await followupService.createFollowup(payload, req.user, req.ip);
    return created(res, 'Follow-up created', data);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const data = await followupService.listFollowups(req.query, req.user);
    return success(res, 'Follow-ups fetched', data);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const payload = parseOrThrow(updateFollowupSchema, req.body);
    const data = await followupService.updateFollowup(req.params.id, payload, req.user, req.ip);
    return success(res, 'Follow-up updated', data);
  } catch (err) {
    next(err);
  }
}

async function status(req, res, next) {
  try {
    const payload = parseOrThrow(followupStatusSchema, req.body);
    const data = await followupService.changeFollowupStatus(req.params.id, payload, req.user, req.ip);
    return success(res, 'Follow-up status updated', data);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, update, status };

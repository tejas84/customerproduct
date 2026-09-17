const { listAuditLogs } = require('../services/auditList.service');
const { getSettings, updateSettings } = require('../services/setting.service');
const { success } = require('../utils/response');
const { ENQUIRY_TYPES, PRODUCTS_SERVICES, ENQUIRY_STATUSES, SOURCES } = require('../constants');

async function audit(req, res, next) {
  try {
    const data = await listAuditLogs(req.query);
    return success(res, 'Audit logs fetched', data);
  } catch (err) {
    next(err);
  }
}

async function settings(req, res, next) {
  try {
    const data = await getSettings();
    return success(res, 'Settings fetched', {
      ...data,
      enquiry_types: ENQUIRY_TYPES,
      business_types: ENQUIRY_TYPES,
      products_services: PRODUCTS_SERVICES,
      statuses: ENQUIRY_STATUSES,
      sources: SOURCES,
    });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = await updateSettings(req.body, req.user, req.ip);
    return success(res, 'Settings updated', data);
  } catch (err) {
    next(err);
  }
}

module.exports = { audit, settings, update };

const enquiryService = require('../services/enquiry.service');
const { parseOrThrow } = require('../utils/validate');
const {
  createEnquirySchema,
  updateEnquirySchema,
  statusSchema,
  assignSchema,
  remarkSchema,
} = require('../validators/enquiry.validator');
const { success, created } = require('../utils/response');

async function create(req, res, next) {
  try {
    const payload = parseOrThrow(createEnquirySchema, req.body);
    const result = await enquiryService.createEnquiry(payload, { userId: req.user?.id, ip: req.ip });
    const message = result.duplicate
      ? 'A matching enquiry was already received recently. Returning the existing enquiry.'
      : 'Enquiry submitted successfully';
    const status = result.duplicate ? 200 : 201;
    return res.status(status).json({
      success: true,
      message,
      data: {
        enquiry: result.enquiry,
        enquiry_number: result.enquiry.enquiry_number,
        submitted_at: result.enquiry.created_at,
        whatsapp: result.whatsapp
          ? {
              status: result.whatsapp.message_status,
              id: result.whatsapp.id,
              failure_reason: result.whatsapp.failure_reason,
            }
          : null,
        confirmation: result.confirmation,
        duplicate: result.duplicate,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const data = await enquiryService.listEnquiries(req.query, req.user);
    return success(res, 'Enquiries fetched', data);
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const data = await enquiryService.getEnquiry(req.params.id, req.user);
    return success(res, 'Enquiry fetched', data);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const payload = parseOrThrow(updateEnquirySchema, req.body);
    const data = await enquiryService.updateEnquiry(req.params.id, payload, req.user, req.ip);
    return success(res, 'Enquiry updated', data);
  } catch (err) {
    next(err);
  }
}

async function status(req, res, next) {
  try {
    const payload = parseOrThrow(statusSchema, req.body);
    const data = await enquiryService.changeStatus(req.params.id, payload, req.user, req.ip);
    return success(res, 'Status updated', data);
  } catch (err) {
    next(err);
  }
}

async function assign(req, res, next) {
  try {
    const payload = parseOrThrow(assignSchema, req.body);
    const data = await enquiryService.assignEnquiry(req.params.id, payload, req.user, req.ip);
    return success(res, 'Enquiry assigned', data);
  } catch (err) {
    next(err);
  }
}

async function remark(req, res, next) {
  try {
    const payload = parseOrThrow(remarkSchema, req.body);
    const data = await enquiryService.addRemark(req.params.id, payload, req.user, req.ip);
    return success(res, 'Remark added', data);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, get, update, status, assign, remark };

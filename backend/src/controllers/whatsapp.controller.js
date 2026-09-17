const whatsappService = require('../services/whatsapp.service');
const env = require('../config/env');
const { success } = require('../utils/response');
const { UnauthorizedError } = require('../utils/errors');

async function list(req, res, next) {
  try {
    const data = await whatsappService.listMessages(req.query);
    return success(res, 'WhatsApp logs fetched', data);
  } catch (err) {
    next(err);
  }
}

async function send(req, res, next) {
  try {
    const data = await whatsappService.sendForEnquiry(req.body.enquiry_id, req.user, req.ip);
    return success(res, 'WhatsApp message queued', data);
  } catch (err) {
    next(err);
  }
}

async function retry(req, res, next) {
  try {
    const data = await whatsappService.retry(req.params.id, req.user, req.ip);
    return success(res, 'WhatsApp retry attempted', data);
  } catch (err) {
    next(err);
  }
}

async function webhook(req, res, next) {
  try {
    const secret = req.headers['x-webhook-secret'];
    if (env.whatsapp.webhookSecret && secret !== env.whatsapp.webhookSecret) {
      throw new UnauthorizedError('Invalid webhook secret');
    }
    const data = await whatsappService.applyWebhook(req.body);
    return success(res, 'Webhook processed', data);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, send, retry, webhook };

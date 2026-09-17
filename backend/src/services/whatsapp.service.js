const { WhatsappMessage } = require('../models');
const whatsapp = require('../integrations/whatsapp');
const { writeAudit } = require('./audit.service');
const { NotFoundError } = require('../utils/errors');
const env = require('../config/env');

function acknowledgementText(enquiry, customer) {
  return [
    `Hello ${customer.customer_name},`,
    `Your enquiry has been received.`,
    `Enquiry Number: ${enquiry.enquiry_number}`,
    `Business Type: ${enquiry.enquiry_type}`,
    `Product/Service: ${enquiry.product_service}`,
    `Our team at ${env.company.name} will contact you shortly.`,
  ].join('\n');
}

async function persistResult({ enquiry, customer, result, preview }) {
  const record = await WhatsappMessage.create({
    enquiry_id: enquiry?.id || null,
    mobile: customer.mobile,
    message_status: result.ok ? 'SENT' : 'FAILED',
    provider_message_id: result.providerMessageId || null,
    failure_reason: result.ok ? null : result.failureReason || 'Unknown WhatsApp error',
    payload_preview: preview?.slice(0, 500) || null,
    sent_at: result.ok ? new Date() : null,
  });
  return record;
}

async function sendEnquiryAcknowledgement({ enquiry, customer }) {
  const body = acknowledgementText(enquiry, customer);

  try {
    const result = await whatsapp.sendMessage({
      to: customer.mobile,
      body,
      template: {
        name: env.whatsapp.templateName,
        language: env.whatsapp.templateLanguage,
        parameters: [
          customer.customer_name,
          enquiry.enquiry_number,
          enquiry.enquiry_type,
        ],
      },
    });

    const record = await persistResult({
      enquiry,
      customer,
      result,
      preview: body,
    });

    return record;
  } catch (err) {
    const record = await persistResult({
      enquiry,
      customer,
      result: {
        ok: false,
        failureReason: err.message,
      },
      preview: body,
    });

    return record;
  }
}

async function retry(id, user, ip) {
  const existing = await WhatsappMessage.findByPk(id);
  if (!existing) throw new NotFoundError('WhatsApp message not found');
  const { Enquiry, Customer } = require('../models');
  const enquiry = await Enquiry.findByPk(existing.enquiry_id, { include: [{ model: Customer, as: 'customer' }] });
  const record = await sendEnquiryAcknowledgement({ enquiry, customer: enquiry.customer });
  await writeAudit({
    userId: user?.id,
    action: 'WHATSAPP_RETRY',
    entityType: 'WhatsappMessage',
    entityId: record.id,
    ip,
  });
  return record;
}

async function sendForEnquiry(enquiryId, user, ip) {
  const { Enquiry, Customer } = require('../models');
  const enquiry = await Enquiry.findByPk(enquiryId, { include: [{ model: Customer, as: 'customer' }] });
  if (!enquiry) throw new NotFoundError('Enquiry not found');
  const record = await sendEnquiryAcknowledgement({ enquiry, customer: enquiry.customer });
  await writeAudit({
    userId: user?.id,
    action: 'WHATSAPP_SEND',
    entityType: 'Enquiry',
    entityId: enquiry.id,
    ip,
  });
  return record;
}

async function listMessages({ page = 1, limit = 20, status, search }) {
  const { Op } = require('sequelize');
  const where = {};
  if (status) where.message_status = status;
  if (search) where.mobile = { [Op.like]: `%${search}%` };
  const offset = (page - 1) * limit;
  const { rows, count } = await WhatsappMessage.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit: Number(limit),
    offset,
  });
  return { items: rows, total: count, page: Number(page), limit: Number(limit) };
}

async function applyWebhook(payload) {
  const providerId = payload.provider_message_id || payload.id;
  if (!providerId) return null;
  const record = await WhatsappMessage.findOne({ where: { provider_message_id: providerId } });
  if (!record) return null;
  const status = String(payload.status || '').toUpperCase();
  if (['SENT', 'DELIVERED', 'FAILED', 'PENDING'].includes(status)) {
    await record.update({ message_status: status, failure_reason: payload.failure_reason || record.failure_reason });
  }
  return record;
}

module.exports = {
  sendEnquiryAcknowledgement,
  retry,
  sendForEnquiry,
  listMessages,
  applyWebhook,
};

const { Op } = require('sequelize');
const env = require('../config/env');
const {
  sequelize,
  Enquiry,
  Customer,
  User,
  EnquiryStatusHistory,
  Followup,
  EnquiryConfirmation,
  WhatsappMessage,
} = require('../models');
const { findOrCreateCustomer, nextEnquiryNumber, findRecentDuplicate } = require('./customer.service');
const { generateEnquiryAcknowledgement } = require('../integrations/pdf/acknowledgement');
const whatsappService = require('./whatsapp.service');
const { writeAudit } = require('./audit.service');
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors');
const { STAFF_ALLOWED_STATUSES, ROLES } = require('../constants');

function includeCustomerAssignee() {
  return [
    { model: Customer, as: 'customer' },
    { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
  ];
}

async function createEnquiry(payload, meta = {}) {
  const transaction = await sequelize.transaction();
  try {
    const customer = await findOrCreateCustomer(payload, transaction);
    const duplicate = await findRecentDuplicate(
      {
        customerId: customer.id,
        enquiry_type: payload.enquiry_type,
        product_service: payload.product_service,
        description: payload.description,
      },
      env.duplicateWindowMinutes,
      transaction
    );

    if (duplicate) {
      await transaction.commit();
      const existing = await Enquiry.findByPk(duplicate.id, { include: includeCustomerAssignee() });
      return { enquiry: existing, customer, duplicate: true, whatsapp: null, confirmation: null };
    }

    const enquiryNumber = await nextEnquiryNumber(transaction);
    const enquiry = await Enquiry.create(
      {
        enquiry_number: enquiryNumber,
        customer_id: customer.id,
        enquiry_type: payload.enquiry_type,
        product_service: payload.product_service,
        description: payload.description,
        preferred_contact_method: payload.preferred_contact_method || null,
        status: 'NEW',
        source: payload.source || 'WEBSITE',
      },
      { transaction }
    );

    await EnquiryStatusHistory.create(
      {
        enquiry_id: enquiry.id,
        old_status: null,
        new_status: 'NEW',
        changed_by: meta.userId || null,
        remark: 'Enquiry created',
      },
      { transaction }
    );

    await transaction.commit();

    let confirmation = null;
    try {
      const pdf = await generateEnquiryAcknowledgement(enquiry, customer);
      confirmation = await EnquiryConfirmation.create({
        enquiry_id: enquiry.id,
        confirmation_number: pdf.confirmationNumber,
        file_path: pdf.relativePath,
      });
    } catch (err) {
      console.error('PDF generation failed', err.message);
    }

    const whatsapp = await whatsappService.sendEnquiryAcknowledgement({
      enquiry,
      customer,
      confirmation,
    });

    await writeAudit({
      userId: meta.userId,
      action: 'ENQUIRY_CREATE',
      entityType: 'Enquiry',
      entityId: enquiry.id,
      newValue: { enquiry_number: enquiry.enquiry_number },
      ip: meta.ip,
    });

    const full = await Enquiry.findByPk(enquiry.id, { include: includeCustomerAssignee() });
    return { enquiry: full, customer, duplicate: false, whatsapp, confirmation };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

function staffScope(user) {
  if (user?.role === ROLES.STAFF) {
    return { assigned_to: user.id };
  }
  return {};
}

async function listEnquiries(query, user) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const offset = (page - 1) * limit;
  const where = { ...staffScope(user) };

  if (query.status) where.status = query.status;
  if (query.enquiry_type) where.enquiry_type = query.enquiry_type;
  if (query.product_service) where.product_service = query.product_service;
  if (query.assigned_to) where.assigned_to = query.assigned_to;
  if (query.source) where.source = String(query.source).toUpperCase();
  if (query.from || query.to) {
    where.created_at = {};
    if (query.from) where.created_at[Op.gte] = new Date(`${query.from}T00:00:00`);
    if (query.to) where.created_at[Op.lte] = new Date(`${query.to}T23:59:59`);
  }

  const search = (query.search || '').trim();
  const customerWhere = {};
  if (search) {
    where[Op.or] = [
      { enquiry_number: { [Op.like]: `%${search}%` } },
      { '$customer.customer_name$': { [Op.like]: `%${search}%` } },
      { '$customer.mobile$': { [Op.like]: `%${search}%` } },
      { '$customer.email$': { [Op.like]: `%${search}%` } },
    ];
  }

  const sortBy = ['enquiry_number', 'status', 'created_at', 'enquiry_type'].includes(query.sortBy)
    ? query.sortBy
    : 'created_at';
  const sortOrder = String(query.sortOrder || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const { rows, count } = await Enquiry.findAndCountAll({
    where,
    include: [
      { model: Customer, as: 'customer', required: !!search },
      { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
    ],
    distinct: true,
    subQuery: false,
    limit,
    offset,
    order: [[sortBy, sortOrder]],
  });

  return { items: rows, total: count, page, limit, pages: Math.ceil(count / limit) };
}

async function getEnquiry(id, user) {
  const enquiry = await Enquiry.findByPk(id, {
    include: [
      ...includeCustomerAssignee(),
      { model: EnquiryStatusHistory, as: 'statusHistory', include: [{ model: User, as: 'changedByUser', attributes: ['id', 'name'] }] },
      { model: Followup, as: 'followups', include: [{ model: User, as: 'assignee', attributes: ['id', 'name'] }] },
      { model: EnquiryConfirmation, as: 'confirmations' },
      { model: WhatsappMessage, as: 'whatsappMessages' },
    ],
    order: [
      [{ model: EnquiryStatusHistory, as: 'statusHistory' }, 'created_at', 'ASC'],
      [{ model: Followup, as: 'followups' }, 'followup_date', 'DESC'],
    ],
  });
  if (!enquiry) throw new NotFoundError('Enquiry not found');
  if (user?.role === ROLES.STAFF && enquiry.assigned_to !== user.id) {
    throw new ForbiddenError('You can only view assigned enquiries');
  }
  return enquiry;
}

async function updateEnquiry(id, payload, user, ip) {
  const enquiry = await getEnquiry(id, user);
  await enquiry.update(payload);
  await writeAudit({
    userId: user.id,
    action: 'ENQUIRY_UPDATE',
    entityType: 'Enquiry',
    entityId: enquiry.id,
    newValue: payload,
    ip,
  });
  return getEnquiry(id, user);
}

async function changeStatus(id, { status, remark }, user, ip) {
  const enquiry = await getEnquiry(id, user);
  if (user.role === ROLES.STAFF && !STAFF_ALLOWED_STATUSES.includes(status)) {
    throw new ForbiddenError('Staff cannot set this status');
  }
  const old = enquiry.status;
  await sequelize.transaction(async (t) => {
    await enquiry.update({ status }, { transaction: t });
    await EnquiryStatusHistory.create(
      {
        enquiry_id: enquiry.id,
        old_status: old,
        new_status: status,
        changed_by: user.id,
        remark: remark || `Status changed to ${status}`,
      },
      { transaction: t }
    );
  });
  await writeAudit({
    userId: user.id,
    action: 'ENQUIRY_STATUS_CHANGE',
    entityType: 'Enquiry',
    entityId: enquiry.id,
    oldValue: { status: old },
    newValue: { status, remark },
    ip,
  });
  return getEnquiry(id, user);
}

async function assignEnquiry(id, { assigned_to, remark }, user, ip) {
  if (user.role === ROLES.STAFF) throw new ForbiddenError();
  const enquiry = await getEnquiry(id, user);
  const assignee = await User.findByPk(assigned_to);
  if (!assignee || !assignee.is_active) throw new ValidationError('Assigned user is invalid or inactive');

  const previousStatus = enquiry.status;
  const nextStatus = previousStatus === 'NEW' ? 'ASSIGNED' : previousStatus;
  await sequelize.transaction(async (t) => {
    await enquiry.update({ assigned_to, status: nextStatus }, { transaction: t });
    await EnquiryStatusHistory.create(
      {
        enquiry_id: enquiry.id,
        old_status: previousStatus,
        new_status: nextStatus,
        changed_by: user.id,
        remark: remark || (previousStatus === 'NEW' ? `Assigned to ${assignee.name}` : `Reassigned to ${assignee.name}`),
      },
      { transaction: t }
    );
  });

  await writeAudit({
    userId: user.id,
    action: 'ENQUIRY_ASSIGN',
    entityType: 'Enquiry',
    entityId: enquiry.id,
    newValue: { assigned_to },
    ip,
  });
  return getEnquiry(id, user);
}

async function addRemark(id, { remark }, user, ip) {
  const enquiry = await getEnquiry(id, user);
  await EnquiryStatusHistory.create({
    enquiry_id: enquiry.id,
    old_status: enquiry.status,
    new_status: enquiry.status,
    changed_by: user.id,
    remark,
  });
  await writeAudit({
    userId: user.id,
    action: 'ENQUIRY_REMARK',
    entityType: 'Enquiry',
    entityId: enquiry.id,
    newValue: { remark },
    ip,
  });
  return getEnquiry(id, user);
}

module.exports = {
  createEnquiry,
  listEnquiries,
  getEnquiry,
  updateEnquiry,
  changeStatus,
  assignEnquiry,
  addRemark,
};

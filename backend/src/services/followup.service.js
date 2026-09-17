const { Op } = require('sequelize');
const { Followup, Enquiry, User, Customer } = require('../models');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const { ROLES } = require('../constants');
const { writeAudit } = require('./audit.service');

async function createFollowup(payload, user, ip) {
  const enquiry = await Enquiry.findByPk(payload.enquiry_id);
  if (!enquiry) throw new NotFoundError('Enquiry not found');
  if (user.role === ROLES.STAFF && enquiry.assigned_to !== user.id) {
    throw new ForbiddenError('You can only create follow-ups for assigned enquiries');
  }
  const followup = await Followup.create(payload);
  await writeAudit({
    userId: user.id,
    action: 'FOLLOWUP_CREATE',
    entityType: 'Followup',
    entityId: followup.id,
    newValue: payload,
    ip,
  });
  return getFollowup(followup.id, user);
}

async function getFollowup(id, user) {
  const followup = await Followup.findByPk(id, {
    include: [
      { model: Enquiry, as: 'enquiry', include: [{ model: Customer, as: 'customer' }] },
      { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
    ],
  });
  if (!followup) throw new NotFoundError('Follow-up not found');
  if (user.role === ROLES.STAFF && followup.assigned_to !== user.id) {
    throw new ForbiddenError();
  }
  return followup;
}

async function listFollowups(query, user) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const where = {};
  if (user.role === ROLES.STAFF) where.assigned_to = user.id;
  if (query.status) where.status = query.status;
  if (query.assigned_to && user.role !== ROLES.STAFF) where.assigned_to = query.assigned_to;
  if (query.bucket === 'today') {
    where.followup_date = new Date().toISOString().slice(0, 10);
    where.status = where.status || 'PENDING';
  }
  if (query.bucket === 'upcoming') {
    where.followup_date = { [Op.gt]: new Date().toISOString().slice(0, 10) };
    where.status = 'PENDING';
  }
  if (query.bucket === 'overdue') {
    where.followup_date = { [Op.lt]: new Date().toISOString().slice(0, 10) };
    where.status = 'PENDING';
  }

  const { rows, count } = await Followup.findAndCountAll({
    where,
    include: [
      { model: Enquiry, as: 'enquiry', include: [{ model: Customer, as: 'customer' }] },
      { model: User, as: 'assignee', attributes: ['id', 'name'] },
    ],
    limit,
    offset: (page - 1) * limit,
    order: [['followup_date', 'ASC'], ['followup_time', 'ASC']],
  });
  return { items: rows, total: count, page, limit };
}

async function updateFollowup(id, payload, user, ip) {
  const followup = await getFollowup(id, user);
  await followup.update(payload);
  await writeAudit({
    userId: user.id,
    action: 'FOLLOWUP_UPDATE',
    entityType: 'Followup',
    entityId: followup.id,
    newValue: payload,
    ip,
  });
  return getFollowup(id, user);
}

async function changeFollowupStatus(id, { status, remark }, user, ip) {
  const followup = await getFollowup(id, user);
  await followup.update({ status, remark: remark || followup.remark });
  await writeAudit({
    userId: user.id,
    action: 'FOLLOWUP_STATUS',
    entityType: 'Followup',
    entityId: followup.id,
    newValue: { status },
    ip,
  });
  return getFollowup(id, user);
}

module.exports = { createFollowup, listFollowups, getFollowup, updateFollowup, changeFollowupStatus };

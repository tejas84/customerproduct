const { Op, fn, col, literal } = require('sequelize');
const { Enquiry, Followup, sequelize } = require('../models');
const { ROLES } = require('../constants');

function scope(user) {
  if (user?.role === ROLES.STAFF) return { assigned_to: user.id };
  return {};
}

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

async function summary(user) {
  const where = scope(user);
  const now = new Date();
  const today = startOfDay(now);
  const week = startOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));
  const month = new Date(now.getFullYear(), now.getMonth(), 1);

  const total = await Enquiry.count({ where });
  const todayCount = await Enquiry.count({ where: { ...where, created_at: { [Op.gte]: today } } });
  const weekCount = await Enquiry.count({ where: { ...where, created_at: { [Op.gte]: week } } });
  const monthCount = await Enquiry.count({ where: { ...where, created_at: { [Op.gte]: month } } });

  const statuses = [
    'NEW',
    'ASSIGNED',
    'CONTACTED',
    'FOLLOW_UP',
    'IN_PROGRESS',
    'CONVERTED',
    'CLOSED',
    'REJECTED',
  ];
  const byStatus = {};
  for (const status of statuses) {
    byStatus[status] = await Enquiry.count({ where: { ...where, status } });
  }

  const converted = byStatus.CONVERTED || 0;
  const conversionRate = total ? Number(((converted / total) * 100).toFixed(2)) : 0;

  const followupWhere = user?.role === ROLES.STAFF ? { assigned_to: user.id, status: 'PENDING' } : { status: 'PENDING' };
  const pendingFollowups = await Followup.count({ where: followupWhere });

  return {
    totalEnquiries: total,
    todayEnquiries: todayCount,
    weekEnquiries: weekCount,
    monthEnquiries: monthCount,
    newEnquiries: byStatus.NEW,
    assignedEnquiries: byStatus.ASSIGNED,
    followUps: byStatus.FOLLOW_UP,
    pendingFollowups,
    inProgress: byStatus.IN_PROGRESS,
    converted,
    closed: byStatus.CLOSED,
    conversionRate,
    byStatus,
  };
}

async function trend(user, { days = 14 } = {}) {
  const since = startOfDay(new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000));
  const rows = await Enquiry.findAll({
    attributes: [[fn('DATE', col('created_at')), 'day'], [fn('COUNT', col('id')), 'count']],
    where: { ...scope(user), created_at: { [Op.gte]: since } },
    group: [literal('DATE(created_at)')],
    order: [[literal('DATE(created_at)'), 'ASC']],
    raw: true,
  });
  return rows;
}

async function groupBy(user, field) {
  const rows = await Enquiry.findAll({
    attributes: [[col(field), 'name'], [fn('COUNT', col('id')), 'count']],
    where: scope(user),
    group: [field],
    raw: true,
  });
  return rows;
}

async function monthlyTrend(user) {
  const rows = await Enquiry.findAll({
    attributes: [
      [fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'month'],
      [fn('COUNT', col('id')), 'count'],
    ],
    where: scope(user),
    group: [literal("DATE_FORMAT(created_at, '%Y-%m')")],
    order: [[literal("DATE_FORMAT(created_at, '%Y-%m')"), 'ASC']],
    raw: true,
  });
  return rows;
}

module.exports = { summary, trend, groupBy, monthlyTrend };

const { Op, fn, col } = require('sequelize');
const { Enquiry, User, Customer } = require('../models');

function dateWhere(from, to) {
  const created_at = {};
  if (from) created_at[Op.gte] = new Date(`${from}T00:00:00`);
  if (to) created_at[Op.lte] = new Date(`${to}T23:59:59`);
  return Object.keys(created_at).length ? { created_at } : {};
}

async function enquiryReport({ from, to, groupBy = 'status' }) {
  const fieldMap = {
    status: 'status',
    type: 'enquiry_type',
    product: 'product_service',
    source: 'source',
    day: null,
  };
  const where = dateWhere(from, to);

  if (groupBy === 'employee') {
    const rows = await Enquiry.findAll({
      attributes: ['assigned_to', [fn('COUNT', col('Enquiry.id')), 'count']],
      where,
      include: [{ model: User, as: 'assignee', attributes: ['id', 'name'] }],
      group: ['assigned_to', 'assignee.id'],
      raw: false,
    });
    return rows.map((r) => ({
      name: r.assignee?.name || 'Unassigned',
      count: Number(r.get('count')),
    }));
  }

  if (groupBy === 'day') {
    const { literal } = require('sequelize');
    return Enquiry.findAll({
      attributes: [[fn('DATE', col('created_at')), 'name'], [fn('COUNT', col('id')), 'count']],
      where,
      group: [literal('DATE(created_at)')],
      order: [[literal('DATE(created_at)'), 'ASC']],
      raw: true,
    });
  }

  const field = fieldMap[groupBy] || 'status';
  return Enquiry.findAll({
    attributes: [[col(field), 'name'], [fn('COUNT', col('id')), 'count']],
    where,
    group: [field],
    raw: true,
  });
}

async function conversionReport({ from, to }) {
  const where = dateWhere(from, to);
  const total = await Enquiry.count({ where });
  const converted = await Enquiry.count({ where: { ...where, status: 'CONVERTED' } });
  const closed = await Enquiry.count({ where: { ...where, status: 'CLOSED' } });
  const rejected = await Enquiry.count({ where: { ...where, status: 'REJECTED' } });
  return {
    total,
    converted,
    closed,
    rejected,
    conversionRate: total ? Number(((converted / total) * 100).toFixed(2)) : 0,
  };
}

async function detailedEnquiries({ from, to }) {
  return Enquiry.findAll({
    where: dateWhere(from, to),
    include: [
      { model: Customer, as: 'customer' },
      { model: User, as: 'assignee', attributes: ['id', 'name'] },
    ],
    order: [['created_at', 'DESC']],
  });
}

function toCsv(rows) {
  const header = ['Enquiry Number', 'Customer', 'Mobile', 'Business Type', 'Product', 'Status', 'Assigned To', 'Source', 'Created'];
  const lines = [header.join(',')];
  rows.forEach((r) => {
    const c = r.customer || {};
    const vals = [
      r.enquiry_number,
      c.customer_name,
      c.mobile,
      r.enquiry_type,
      r.product_service,
      r.status,
      r.assignee?.name || '',
      r.source,
      r.created_at,
    ].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`);
    lines.push(vals.join(','));
  });
  return lines.join('\n');
}

module.exports = { enquiryReport, conversionReport, detailedEnquiries, toCsv };

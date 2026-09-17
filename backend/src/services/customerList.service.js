const { Op } = require('sequelize');
const { Customer, Enquiry } = require('../models');
const { NotFoundError } = require('../utils/errors');

async function listCustomers({ page = 1, limit = 10, search = '' }) {
  const where = {};
  if (search) {
    where[Op.or] = [
      { customer_name: { [Op.like]: `%${search}%` } },
      { mobile: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }
  const offset = (page - 1) * Number(limit);
  const { rows, count } = await Customer.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [['created_at', 'DESC']],
  });
  return { items: rows, total: count, page: Number(page), limit: Number(limit), pages: Math.ceil(count / limit) };
}

async function getCustomer(id) {
  const customer = await Customer.findByPk(id, {
    include: [{ model: Enquiry, as: 'enquiries', order: [['created_at', 'DESC']] }],
  });
  if (!customer) throw new NotFoundError('Customer not found');
  const json = customer.toJSON();
  json.total_enquiries = json.enquiries?.length || 0;
  return json;
}

module.exports = { listCustomers, getCustomer };

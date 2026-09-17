const { Op } = require('sequelize');
const { sequelize, Customer, Enquiry } = require('../models');
const { formatEnquiryNumber } = require('../utils/helpers');
const { EnquiryCounter } = require('../models');

async function findOrCreateCustomer(payload, transaction) {
  let customer = await Customer.findOne({
    where: { mobile: payload.mobile },
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (customer) {
    await customer.update(
      {
        customer_name: payload.customer_name,
        email: payload.email || customer.email,
        address: payload.address || customer.address,
        city: payload.city || customer.city,
      },
      { transaction }
    );
    return customer;
  }

  return Customer.create(
    {
      customer_name: payload.customer_name,
      mobile: payload.mobile,
      email: payload.email,
      address: payload.address,
      city: payload.city,
    },
    { transaction }
  );
}

async function nextEnquiryNumber(transaction) {
  const calendarYear = new Date().getFullYear();
  const [counter] = await EnquiryCounter.findOrCreate({
    where: { year: calendarYear },
    defaults: { year: calendarYear, last_value: 0 },
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
  await counter.increment('last_value', { by: 1, transaction });
  await counter.reload({ transaction });
  return formatEnquiryNumber(calendarYear, counter.last_value);
}

async function findRecentDuplicate({ customerId, enquiry_type, product_service, description }, minutes, transaction) {
  const since = new Date(Date.now() - minutes * 60 * 1000);
  return Enquiry.findOne({
    where: {
      customer_id: customerId,
      enquiry_type,
      product_service,
      description,
      created_at: { [Op.gte]: since },
    },
    transaction,
  });
}

module.exports = { findOrCreateCustomer, nextEnquiryNumber, findRecentDuplicate, sequelize };

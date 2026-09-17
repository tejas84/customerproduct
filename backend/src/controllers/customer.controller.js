const customerList = require('../services/customerList.service');
const { success } = require('../utils/response');

async function list(req, res, next) {
  try {
    const data = await customerList.listCustomers(req.query);
    return success(res, 'Customers fetched', data);
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const data = await customerList.getCustomer(req.params.id);
    return success(res, 'Customer fetched', data);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, get };

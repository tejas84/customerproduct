const dashboardService = require('../services/dashboard.service');
const { success } = require('../utils/response');

async function summary(req, res, next) {
  try {
    const data = await dashboardService.summary(req.user);
    return success(res, 'Dashboard summary', data);
  } catch (err) {
    next(err);
  }
}

async function trend(req, res, next) {
  try {
    const data = await dashboardService.trend(req.user, { days: Number(req.query.days || 14) });
    return success(res, 'Enquiry trend', data);
  } catch (err) {
    next(err);
  }
}

async function statusSummary(req, res, next) {
  try {
    const data = await dashboardService.groupBy(req.user, 'status');
    return success(res, 'Status summary', data);
  } catch (err) {
    next(err);
  }
}

async function typeSummary(req, res, next) {
  try {
    const data = await dashboardService.groupBy(req.user, 'enquiry_type');
    return success(res, 'Type summary', data);
  } catch (err) {
    next(err);
  }
}

async function productSummary(req, res, next) {
  try {
    const data = await dashboardService.groupBy(req.user, 'product_service');
    return success(res, 'Product summary', data);
  } catch (err) {
    next(err);
  }
}

async function monthly(req, res, next) {
  try {
    const data = await dashboardService.monthlyTrend(req.user);
    return success(res, 'Monthly trend', data);
  } catch (err) {
    next(err);
  }
}

module.exports = { summary, trend, statusSummary, typeSummary, productSummary, monthly };

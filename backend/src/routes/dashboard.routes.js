const express = require('express');
const controller = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants');

const router = express.Router();
router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF));
router.get('/summary', controller.summary);
router.get('/enquiries-trend', controller.trend);
router.get('/status-summary', controller.statusSummary);
router.get('/type-summary', controller.typeSummary);
router.get('/product-summary', controller.productSummary);
router.get('/monthly-trend', controller.monthly);

module.exports = router;

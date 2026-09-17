const express = require('express');
const controller = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants');

const router = express.Router();
router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN));
router.get('/enquiries', controller.enquiries);
router.get('/conversion', controller.conversion);
router.get('/enquiries/export', controller.exportCsv);

module.exports = router;

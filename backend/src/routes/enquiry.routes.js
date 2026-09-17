const express = require('express');
const rateLimit = require('express-rate-limit');
const env = require('../config/env');
const controller = require('../controllers/enquiry.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants');

const router = express.Router();

const enquiryLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.enquiryMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many enquiry submissions. Please try again later.', errors: [] },
});

router.post('/', enquiryLimiter, controller.create);
router.get('/', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF), controller.list);
router.get('/:id', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF), controller.get);
router.put('/:id', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF), controller.update);
router.patch('/:id/status', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF), controller.status);
router.patch('/:id/assign', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), controller.assign);
router.post('/:id/remarks', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF), controller.remark);

module.exports = router;

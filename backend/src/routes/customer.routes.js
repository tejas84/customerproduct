const express = require('express');
const controller = require('../controllers/customer.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants');

const router = express.Router();
router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF));
router.get('/', controller.list);
router.get('/:id', controller.get);

module.exports = router;

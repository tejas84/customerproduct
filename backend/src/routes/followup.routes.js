const express = require('express');
const controller = require('../controllers/followup.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants');

const router = express.Router();
router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF));
router.post('/', controller.create);
router.get('/', controller.list);
router.put('/:id', controller.update);
router.patch('/:id/status', controller.status);

module.exports = router;

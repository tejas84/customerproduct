const express = require('express');
const controller = require('../controllers/whatsapp.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants');

const router = express.Router();
router.post('/webhook', controller.webhook);
router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN));
router.get('/', controller.list);
router.post('/send', controller.send);
router.post('/:id/retry', controller.retry);

module.exports = router;

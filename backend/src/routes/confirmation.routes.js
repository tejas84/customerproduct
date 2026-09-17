const express = require('express');
const controller = require('../controllers/confirmation.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants');

const router = express.Router();
router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF));
router.get('/enquiry/:enquiryId/download', controller.downloadByEnquiry);
router.get('/:id', controller.get);
router.get('/:id/download', controller.download);

module.exports = router;

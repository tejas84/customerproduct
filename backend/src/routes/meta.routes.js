const express = require('express');
const controller = require('../controllers/meta.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants');
const { ENQUIRY_TYPES, PRODUCTS_SERVICES, CONTACT_METHODS, SOURCES } = require('../constants');
const { success } = require('../utils/response');

const router = express.Router();

router.get('/form-options', (req, res) => {
  return success(res, 'Form options', {
    enquiry_types: ENQUIRY_TYPES,
    business_types: ENQUIRY_TYPES,
    products_services: PRODUCTS_SERVICES,
    contact_methods: CONTACT_METHODS,
    sources: SOURCES,
  });
});

router.get('/audit-logs', authenticate, authorize(ROLES.SUPER_ADMIN), controller.audit);
router.get('/settings', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), controller.settings);
router.put('/settings', authenticate, authorize(ROLES.SUPER_ADMIN), controller.update);

module.exports = router;

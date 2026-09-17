const express = require('express');
const controller = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');
// assignable list is used by ADMIN when assigning enquiries
const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../constants');

const router = express.Router();
router.get(
  '/assignable',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  controller.list
);
router.use(authenticate, authorize(ROLES.SUPER_ADMIN));
router.get('/', controller.list);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id/status', controller.status);

module.exports = router;

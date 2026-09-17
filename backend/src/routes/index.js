const express = require('express');
const authRoutes = require('./auth.routes');
const enquiryRoutes = require('./enquiry.routes');
const customerRoutes = require('./customer.routes');
const followupRoutes = require('./followup.routes');
const dashboardRoutes = require('./dashboard.routes');
const reportRoutes = require('./report.routes');
const userRoutes = require('./user.routes');
const whatsappRoutes = require('./whatsapp.routes');
const confirmationRoutes = require('./confirmation.routes');
const metaRoutes = require('./meta.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/customers', customerRoutes);
router.use('/followups', followupRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);
router.use('/whatsapp', whatsappRoutes);
router.use('/confirmations', confirmationRoutes);
router.use('/', metaRoutes);

module.exports = router;

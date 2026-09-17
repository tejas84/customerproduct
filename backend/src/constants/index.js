require('dotenv').config();

const BUSINESS_TYPES = [
  'Construction',
  'Real Estate',
  'IT',
  'Hotel',
  'Jewellery',
  'Others',
];

module.exports = {
  ROLES: {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
  },
  ENQUIRY_STATUSES: [
    'NEW',
    'ASSIGNED',
    'CONTACTED',
    'FOLLOW_UP',
    'IN_PROGRESS',
    'CONVERTED',
    'CLOSED',
    'REJECTED',
  ],
  FOLLOWUP_STATUSES: ['PENDING', 'COMPLETED', 'MISSED', 'CANCELLED'],
  WHATSAPP_STATUSES: ['PENDING', 'SENT', 'DELIVERED', 'FAILED'],
  SOURCES: ['QR', 'WEBSITE', 'ADMIN', 'OTHER'],
  CONTACT_METHODS: ['PHONE', 'WHATSAPP', 'EMAIL'],
  BUSINESS_TYPES,
  ENQUIRY_TYPES: BUSINESS_TYPES,
  PRODUCTS_SERVICES: [
    'Residential Interior',
    'Commercial Interior',
    'Modular Kitchen',
    'Furniture',
    'Renovation',
    'Consultation',
    'Other',
  ],
  STAFF_ALLOWED_STATUSES: [
    'CONTACTED',
    'FOLLOW_UP',
    'IN_PROGRESS',
    'CONVERTED',
    'CLOSED',
    'REJECTED',
  ],
};

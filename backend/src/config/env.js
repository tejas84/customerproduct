require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-only-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },
  corsOrigin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  company: {
    name: process.env.COMPANY_NAME || 'Apex Enquiries',
    email: process.env.COMPANY_EMAIL || '',
    phone: process.env.COMPANY_PHONE || '',
    address: process.env.COMPANY_ADDRESS || '',
  },
  whatsapp: {
    provider: process.env.WHATSAPP_PROVIDER || 'mock',
    apiUrl: process.env.WHATSAPP_API_URL || '',
    apiKey: process.env.WHATSAPP_API_KEY || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    webhookSecret: process.env.WHATSAPP_WEBHOOK_SECRET || '',
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    max: Number(process.env.RATE_LIMIT_MAX || 200),
    enquiryMax: Number(process.env.ENQUIRY_RATE_LIMIT_MAX || 20),
  },
  duplicateWindowMinutes: Number(process.env.DUPLICATE_WINDOW_MINUTES || 2),
};

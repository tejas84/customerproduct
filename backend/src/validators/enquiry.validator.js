const { z } = require('zod');
const {
  ENQUIRY_TYPES,
  PRODUCTS_SERVICES,
  CONTACT_METHODS,
  SOURCES,
} = require('../constants');
const { normalizeIndianMobile } = require('../utils/helpers');

const indianMobile = z
  .string()
  .min(10)
  .transform((v) => normalizeIndianMobile(v))
  .refine((v) => /^[6-9]\d{9}$/.test(v), 'Enter a valid Indian mobile number');

const createEnquirySchema = z.object({
  customer_name: z.string().trim().min(2).max(160),
  mobile: indianMobile,
  email: z.string().trim().email().optional().or(z.literal('')).transform((v) => v || null),
  address: z.string().trim().max(500).optional().or(z.literal('')).transform((v) => v || null),
  city: z.string().trim().max(100).optional().or(z.literal('')).transform((v) => v || null),
  enquiry_type: z.enum(ENQUIRY_TYPES),
  product_service: z
    .enum(PRODUCTS_SERVICES)
    .optional()
    .or(z.literal(''))
    .transform((v) => v || 'Other'),
  description: z.string().trim().min(10).max(4000),
  preferred_contact_method: z
    .enum(CONTACT_METHODS)
    .optional()
    .nullable(),
  source: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return 'WEBSITE';
      const upper = String(v).toUpperCase();
      return SOURCES.includes(upper) ? upper : 'OTHER';
    }),
});

const updateEnquirySchema = z.object({
  enquiry_type: z.enum(ENQUIRY_TYPES).optional(),
  product_service: z.enum(PRODUCTS_SERVICES).optional(),
  description: z.string().trim().min(10).max(4000).optional(),
  preferred_contact_method: z.enum(CONTACT_METHODS).optional().nullable(),
});

const statusSchema = z.object({
  status: z.enum([
    'NEW',
    'ASSIGNED',
    'CONTACTED',
    'FOLLOW_UP',
    'IN_PROGRESS',
    'CONVERTED',
    'CLOSED',
    'REJECTED',
  ]),
  remark: z.string().trim().max(500).optional().nullable(),
});

const assignSchema = z.object({
  assigned_to: z.coerce.number().int().positive(),
  remark: z.string().trim().max(500).optional().nullable(),
});

const remarkSchema = z.object({
  remark: z.string().trim().min(2).max(500),
});

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  sortBy: z.string().optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional().default('desc'),
});

module.exports = {
  createEnquirySchema,
  updateEnquirySchema,
  statusSchema,
  assignSchema,
  remarkSchema,
  paginationSchema,
};

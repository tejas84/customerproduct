import { z } from 'zod';
import { BUSINESS_TYPES, CONTACT_METHODS } from '../constants';

export const enquiryFormSchema = z.object({
  customer_name: z.string().trim().min(2, 'Please enter your full name'),
  mobile: z
    .string()
    .trim()
    .refine((v) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, '').replace(/^91/, '').slice(-10)), {
      message: 'Enter a valid 10-digit Indian mobile number',
    }),
  email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  enquiry_type: z.enum(BUSINESS_TYPES, { errorMap: () => ({ message: 'Select a business type' }) }),
  description: z.string().trim().min(10, 'Please describe your enquiry (at least 10 characters)'),
  preferred_contact_method: z.enum(CONTACT_METHODS).optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

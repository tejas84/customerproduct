import { describe, expect, it } from 'vitest';
import { enquiryFormSchema, loginSchema } from '../validations/enquiry.js';

describe('customer form validation', () => {
  it('rejects short name and invalid mobile', () => {
    const result = enquiryFormSchema.safeParse({
      customer_name: 'A',
      mobile: '123',
      enquiry_type: 'Construction',
      description: 'Need help',
    });
    expect(result.success).toBe(false);
  });

  it('accepts a valid enquiry payload', () => {
    const result = enquiryFormSchema.safeParse({
      customer_name: 'Anita Sharma',
      mobile: '9876543210',
      email: 'anita@example.com',
      enquiry_type: 'Real Estate',
      description: 'Looking for a modular kitchen quotation',
      preferred_contact_method: 'WHATSAPP',
    });
    expect(result.success).toBe(true);
  });
});

describe('admin login validation', () => {
  it('requires a proper email and password', () => {
    expect(loginSchema.safeParse({ email: 'x', password: '1' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'admin@example.com', password: 'Admin@12345' }).success).toBe(true);
  });
});

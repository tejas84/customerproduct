const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatEnquiryNumber, normalizeIndianMobile, isValidIndianMobile } = require('../src/utils/helpers');
const { createEnquirySchema } = require('../src/validators/enquiry.validator');
const { MockWhatsAppProvider } = require('../src/integrations/whatsapp/provider');
const { loginSchema } = require('../src/validators/auth.validator');
const { formatZodError } = require('../src/utils/validate');

describe('enquiry number format', () => {
  it('pads sequence to 6 digits', () => {
    assert.equal(formatEnquiryNumber(2026, 1), 'ENQ-2026-000001');
    assert.equal(formatEnquiryNumber(2026, 42), 'ENQ-2026-000042');
  });
});

describe('indian mobile', () => {
  it('normalizes and validates', () => {
    assert.equal(normalizeIndianMobile('+91 9876543210'), '9876543210');
    assert.equal(isValidIndianMobile('9876543210'), true);
    assert.equal(isValidIndianMobile('12345'), false);
  });
});

describe('enquiry validation', () => {
  it('rejects invalid payload', () => {
    const result = createEnquirySchema.safeParse({ customer_name: 'A', mobile: '111' });
    assert.equal(result.success, false);
    assert.ok(formatZodError(result.error).length > 0);
  });

  it('accepts a valid enquiry', () => {
    const result = createEnquirySchema.safeParse({
      customer_name: 'Ravi Kumar',
      mobile: '9876543210',
      email: 'ravi@example.com',
      enquiry_type: 'Hotel',
      description: 'Need a modular kitchen quote for 10x12 room',
      source: 'qr',
    });
    assert.equal(result.success, true);
    assert.equal(result.data.source, 'QR');
    assert.equal(result.data.product_service, 'Other');
  });
});

describe('login validation', () => {
  it('requires email and password', () => {
    const result = loginSchema.safeParse({ email: 'bad', password: 'short' });
    assert.equal(result.success, false);
  });
});

describe('whatsapp mock provider', () => {
  it('sends without throwing', async () => {
    const provider = new MockWhatsAppProvider();
    const result = await provider.sendMessage({ to: '9876543210', body: 'Hello' });
    assert.equal(result.ok, true);
    assert.ok(result.providerMessageId);
  });

  it('failure result does not look like success', async () => {
    const provider = new MockWhatsAppProvider();
    const original = provider.sendMessage;
    provider.sendMessage = async () => ({ ok: false, failureReason: 'timeout' });
    const result = await provider.sendMessage({ to: '9876543210', body: 'x' });
    assert.equal(result.ok, false);
    provider.sendMessage = original;
  });
});

describe('authorization helpers', () => {
  const { authorize } = require('../src/middleware/authorize');
  it('blocks missing role', () => {
    const mw = authorize('ADMIN');
    let captured;
    mw({ user: { role: 'STAFF' } }, {}, (err) => {
      captured = err;
    });
    assert.equal(captured.statusCode, 403);
  });
});

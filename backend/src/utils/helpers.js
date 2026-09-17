function normalizeIndianMobile(value) {
  if (!value) return '';
  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

function isValidIndianMobile(value) {
  return /^[6-9]\d{9}$/.test(normalizeIndianMobile(value));
}

function sanitizeString(value) {
  if (value == null) return value;
  return String(value).trim().replace(/[<>]/g, '');
}

function padEnquirySequence(num) {
  return String(num).padStart(6, '0');
}

function formatEnquiryNumber(year, sequence) {
  return `ENQ-${year}-${padEnquirySequence(sequence)}`;
}

module.exports = {
  normalizeIndianMobile,
  isValidIndianMobile,
  sanitizeString,
  padEnquirySequence,
  formatEnquiryNumber,
};

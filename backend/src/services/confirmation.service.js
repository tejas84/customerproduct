const { EnquiryConfirmation, Enquiry, Customer } = require('../models');
const { NotFoundError } = require('../utils/errors');
const path = require('path');
const fs = require('fs');
const { generateEnquiryAcknowledgement } = require('../integrations/pdf/acknowledgement');

async function getConfirmation(id) {
  const confirmation = await EnquiryConfirmation.findByPk(id, {
    include: [{ model: Enquiry, as: 'enquiry', include: [{ model: Customer, as: 'customer' }] }],
  });
  if (!confirmation) throw new NotFoundError('Confirmation not found');
  return confirmation;
}

async function ensureFile(confirmation) {
  const abs = path.join(__dirname, '../../', confirmation.file_path);
  if (!fs.existsSync(abs) && confirmation.enquiry) {
    const pdf = await generateEnquiryAcknowledgement(confirmation.enquiry, confirmation.enquiry.customer);
    await confirmation.update({ file_path: pdf.relativePath });
    return path.join(__dirname, '../../', pdf.relativePath);
  }
  return abs;
}

async function getByEnquiry(enquiryId) {
  let confirmation = await EnquiryConfirmation.findOne({
    where: { enquiry_id: enquiryId },
    include: [{ model: Enquiry, as: 'enquiry', include: [{ model: Customer, as: 'customer' }] }],
    order: [['created_at', 'DESC']],
  });
  if (!confirmation) {
    const enquiry = await Enquiry.findByPk(enquiryId, { include: [{ model: Customer, as: 'customer' }] });
    if (!enquiry) throw new NotFoundError('Enquiry not found');
    const pdf = await generateEnquiryAcknowledgement(enquiry, enquiry.customer);
    confirmation = await EnquiryConfirmation.create({
      enquiry_id: enquiry.id,
      confirmation_number: pdf.confirmationNumber,
      file_path: pdf.relativePath,
    });
  }
  return confirmation;
}

module.exports = { getConfirmation, ensureFile, getByEnquiry };

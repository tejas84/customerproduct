const confirmationService = require('../services/confirmation.service');
const { success } = require('../utils/response');
const path = require('path');

async function get(req, res, next) {
  try {
    const data = await confirmationService.getConfirmation(req.params.id);
    return success(res, 'Confirmation fetched', data);
  } catch (err) {
    next(err);
  }
}

async function download(req, res, next) {
  try {
    const confirmation = await confirmationService.getConfirmation(req.params.id);
    const file = await confirmationService.ensureFile(confirmation);
    return res.download(file, `${confirmation.confirmation_number}.pdf`);
  } catch (err) {
    next(err);
  }
}

async function downloadByEnquiry(req, res, next) {
  try {
    const confirmation = await confirmationService.getByEnquiry(req.params.enquiryId);
    const file = await confirmationService.ensureFile(
      await confirmationService.getConfirmation(confirmation.id)
    );
    return res.download(file, `${confirmation.confirmation_number}.pdf`);
  } catch (err) {
    next(err);
  }
}

module.exports = { get, download, downloadByEnquiry };

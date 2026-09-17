const reportService = require('../services/report.service');
const { success } = require('../utils/response');

async function enquiries(req, res, next) {
  try {
    const data = await reportService.enquiryReport(req.query);
    return success(res, 'Enquiry report', data);
  } catch (err) {
    next(err);
  }
}

async function conversion(req, res, next) {
  try {
    const data = await reportService.conversionReport(req.query);
    return success(res, 'Conversion report', data);
  } catch (err) {
    next(err);
  }
}

async function exportCsv(req, res, next) {
  try {
    const rows = await reportService.detailedEnquiries(req.query);
    const csv = reportService.toCsv(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="enquiries.csv"');
    return res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
}

module.exports = { enquiries, conversion, exportCsv };

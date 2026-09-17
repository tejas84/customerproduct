const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const env = require('../../config/env');

const storageDir = path.join(__dirname, '../../../storage/confirmations');

function ensureDir() {
  fs.mkdirSync(storageDir, { recursive: true });
}

async function generateEnquiryAcknowledgement(enquiry, customer) {
  ensureDir();
  const confirmationNumber = `ACK-${enquiry.enquiry_number}`;
  const fileName = `${enquiry.enquiry_number}.pdf`;
  const filePath = path.join(storageDir, fileName);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.rect(50, 40, 80, 50).stroke('#1f4e79');
    doc.fontSize(9).fillColor('#1f4e79').text('LOGO', 70, 60);

    doc.fontSize(20).fillColor('#1f4e79').text(env.company.name, 150, 45, { align: 'left' });
    doc.fontSize(12).fillColor('#333').text('Enquiry Acknowledgement', 150, 72);

    doc.moveTo(50, 110).lineTo(545, 110).stroke('#1f4e79');

    doc.moveDown(3);
    doc.fontSize(11).fillColor('#111');
    const rows = [
      ['Enquiry Number', enquiry.enquiry_number],
      ['Confirmation Number', confirmationNumber],
      ['Customer Name', customer.customer_name],
      ['Mobile', customer.mobile],
      ['Email', customer.email || '—'],
      ['Business Type', enquiry.enquiry_type],
      ['Product / Service', enquiry.product_service],
      ['Status', enquiry.status],
      ['Submitted', new Date(enquiry.created_at).toLocaleString('en-IN')],
    ];

    let y = 130;
    rows.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(`${label}:`, 50, y, { width: 160 });
      doc.font('Helvetica').text(String(value), 220, y, { width: 320 });
      y += 22;
    });

    doc.font('Helvetica-Bold').text('Description:', 50, y + 8);
    doc.font('Helvetica').text(enquiry.description, 50, y + 26, { width: 495 });

    doc.fontSize(11).text(
      'Thank you for your enquiry. Our team has received your request and will contact you shortly.',
      50,
      700,
      { width: 495, align: 'center' }
    );
    doc.fontSize(9).fillColor('#666').text(
      `${env.company.name}  •  This is an enquiry acknowledgement, not a payment receipt.`,
      50,
      740,
      { align: 'center', width: 495 }
    );

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return { confirmationNumber, filePath, relativePath: `storage/confirmations/${fileName}` };
}

module.exports = { generateEnquiryAcknowledgement, storageDir };

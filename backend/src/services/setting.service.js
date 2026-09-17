const { Setting } = require('../models');
const env = require('../config/env');
const { writeAudit } = require('./audit.service');
const { getLanIPv4 } = require('../utils/network');

function isLocalhostUrl(url) {
  return /localhost|127\.0\.0\.1/i.test(url || '');
}

async function getSettings() {
  const rows = await Setting.findAll();
  const map = Object.fromEntries(rows.map((r) => [r.setting_key, r.setting_value]));
  const stored = map.public_enquiry_url || `${env.frontendUrl}/enquiry?source=qr`;
  const lanIp = getLanIPv4();
  const qrUrl =
    !isLocalhostUrl(stored)
      ? stored
      : lanIp
        ? `http://${lanIp}:5173/enquiry?source=qr`
        : stored;

  return {
    company_name: env.company.name,
    public_enquiry_url: stored,
    qr_url: qrUrl,
    lan_ip: lanIp,
    whatsapp_provider: env.whatsapp.provider,
  };
}

async function updateSettings(payload, user, ip) {
  if (payload.public_enquiry_url) {
    const [row] = await Setting.findOrCreate({
      where: { setting_key: 'public_enquiry_url' },
      defaults: { setting_value: payload.public_enquiry_url },
    });
    await row.update({ setting_value: payload.public_enquiry_url });
  }
  await writeAudit({
    userId: user.id,
    action: 'SETTINGS_UPDATE',
    entityType: 'Setting',
    newValue: payload,
    ip,
  });
  return getSettings();
}

module.exports = { getSettings, updateSettings };

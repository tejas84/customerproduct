const env = require('../../config/env');
const { createWhatsAppProvider } = require('./provider');

const provider = createWhatsAppProvider(env.whatsapp);

async function sendMessage(payload) {
  return provider.sendMessage(payload);
}

async function sendDocument(payload) {
  return provider.sendDocument(payload);
}

async function getMessageStatus(id) {
  return provider.getMessageStatus(id);
}

module.exports = { sendMessage, sendDocument, getMessageStatus };

function createWhatsAppProvider(config) {
  const mode = (config.provider || 'mock').toLowerCase();
  if (mode === 'http' || (config.apiKey && config.apiUrl)) {
    return new HttpWhatsAppProvider(config);
  }
  return new MockWhatsAppProvider();
}

class MockWhatsAppProvider {
  async sendMessage({ to, body }) {
    return {
      ok: true,
      provider: 'mock',
      providerMessageId: `mock-${Date.now()}`,
      to,
      preview: body.slice(0, 200),
    };
  }

  async sendDocument({ to, caption }) {
    return {
      ok: true,
      provider: 'mock',
      providerMessageId: `mock-doc-${Date.now()}`,
      to,
      preview: caption || 'document',
    };
  }

  async getMessageStatus(providerMessageId) {
    return { ok: true, status: 'SENT', providerMessageId };
  }
}

class HttpWhatsAppProvider {
  constructor(config) {
    this.config = config;
  }

  async sendMessage({ to, body }) {
    const url = `${this.config.apiUrl.replace(/\/$/, '')}/${this.config.phoneNumberId}/messages`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: `91${to}`,
        type: 'text',
        text: { body },
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        ok: false,
        failureReason: data.error?.message || `WhatsApp API error ${response.status}`,
      };
    }
    return {
      ok: true,
      provider: 'http',
      providerMessageId: data.messages?.[0]?.id || null,
      to,
    };
  }

  async sendDocument({ to, caption, link }) {
    const url = `${this.config.apiUrl.replace(/\/$/, '')}/${this.config.phoneNumberId}/messages`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: `91${to}`,
        type: 'document',
        document: { link, caption },
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        ok: false,
        failureReason: data.error?.message || `WhatsApp API error ${response.status}`,
      };
    }
    return {
      ok: true,
      provider: 'http',
      providerMessageId: data.messages?.[0]?.id || null,
      to,
    };
  }

  async getMessageStatus() {
    return { ok: true, status: 'UNKNOWN' };
  }
}

module.exports = { createWhatsAppProvider, MockWhatsAppProvider, HttpWhatsAppProvider };

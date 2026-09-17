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
      preview: body?.slice(0, 200),
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
    return {
      ok: true,
      status: 'SENT',
      providerMessageId,
    };
  }
}

class HttpWhatsAppProvider {
  constructor(config) {
    this.config = config;
  }

  normalizePhone(phone) {
    let value = String(phone || '').replace(/\D/g, '');

    if (value.startsWith('0')) {
      value = value.slice(1);
    }

    if (value.length === 10) {
      value = `91${value}`;
    }

    return value;
  }

  async sendMessage({ to, body, template }) {
    if (template) {
      return this.sendTemplateMessage({
        to,
        template,
      });
    }

    const url =
      `${this.config.apiUrl.replace(/\/$/, '')}` +
      `/${this.config.phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: this.normalizePhone(to),
        type: 'text',
        text: {
          body,
        },
      }),
    });

    return this.parseResponse(response);
  }

  async sendTemplateMessage({ to, template }) {
    const url =
      `${this.config.apiUrl.replace(/\/$/, '')}` +
      `/api/wpbox/sendtemplatemessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: this.config.apiKey,

        phone: this.normalizePhone(to),

        template_name:
          template.name ||
          this.config.templateName ||
          'sms',

        template_language:
          template.language ||
          this.config.templateLanguage ||
          'en',

        components: [
          {
            type: 'body',
            parameters: (template.parameters || []).map((text) => ({
              type: 'text',
              text: String(text),
            })),
          },
        ],
      }),
    });

    return this.parseResponse(response);
  }

  async parseResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        failureReason:
          data.error?.message ||
          data.message ||
          `WhatsApp API error ${response.status}`,
      };
    }

    if (
      data.success === false ||
      data.status === false ||
      data.error
    ) {
      return {
        ok: false,
        failureReason:
          data.error?.message ||
          data.message ||
          'WhatsApp provider rejected the request',
      };
    }

    return {
      ok: true,
      provider: 'http',
      providerMessageId:
        data.messages?.[0]?.id ||
        data.message_id ||
        data.id ||
        data.data?.message_id ||
        data.data?.id ||
        null,
      to: data.to || null,
      response: data,
    };
  }

  async sendDocument({ to, caption, link }) {
    const url =
      `${this.config.apiUrl.replace(/\/$/, '')}` +
      `/${this.config.phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: this.normalizePhone(to),
        type: 'document',
        document: {
          link,
          caption,
        },
      }),
    });

    return this.parseResponse(response);
  }

  async getMessageStatus(providerMessageId) {
    return {
      ok: true,
      status: 'UNKNOWN',
      providerMessageId,
    };
  }
}

module.exports = {
  createWhatsAppProvider,
  MockWhatsAppProvider,
  HttpWhatsAppProvider,
};

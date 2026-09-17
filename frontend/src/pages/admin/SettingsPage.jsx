import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import * as svc from '../../services/enquiryService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function SettingsPage() {
  const toast = useToast();
  const { hasRole } = useAuth();
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    svc.getSettings().then((res) => setSettings(res.data.data));
  }, []);
  if (!settings) return <p>Loading…</p>;
  const qrUrl = settings.qr_url || settings.public_enquiry_url;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="surface-card p-5">
        <h2 className="font-semibold">Public enquiry QR</h2>
        <p className="mt-2 text-sm text-slate-600">
          Scan this with a phone on the same Wi-Fi as this computer. The QR opens the public enquiry form only.
        </p>
        <div className="mt-4 inline-block bg-white p-3">
          <QRCodeSVG value={qrUrl} size={180} />
        </div>
        <p className="mt-3 break-all text-sm font-medium text-slate-800">{qrUrl}</p>
        <p className="mt-2 text-xs text-amber-700">
          Phones cannot open localhost. Keep the backend and frontend running, use the same Wi-Fi, and allow Windows
          Firewall for Node.js / port 5173 if prompted.
        </p>
        {hasRole('SUPER_ADMIN') ? (
          <form
            className="mt-4 space-y-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const public_enquiry_url = e.target.url.value;
              const res = await svc.updateSettings({ public_enquiry_url });
              setSettings((s) => ({ ...s, ...res.data.data }));
              toast.push('Settings saved');
            }}
          >
            <label className="text-xs text-slate-500">Stored public URL (optional override)</label>
            <input name="url" defaultValue={settings.public_enquiry_url} className="w-full rounded border px-3 py-2 text-sm" />
            <button className="btn-primary">Save URL</button>
          </form>
        ) : null}
      </section>
      <section className="surface-card p-5 text-sm">
        <h2 className="font-semibold">Company</h2>
        <p className="mt-2">{settings.company_name}</p>
        <p className="mt-2 text-slate-500">WhatsApp provider: {settings.whatsapp_provider}</p>
        {settings.lan_ip ? <p className="mt-2 text-slate-500">Detected LAN IP: {settings.lan_ip}</p> : null}
        <p className="mt-4 text-slate-500">
          Credentials are configured on the server via environment variables. They are never stored in the frontend.
        </p>
      </section>
    </div>
  );
}

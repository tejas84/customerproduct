import { useEffect, useState } from 'react';
import * as svc from '../../services/enquiryService.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function WhatsappPage() {
  const toast = useToast();
  const [data, setData] = useState({ items: [] });
  const load = () => svc.listWhatsapp({ limit: 50 }).then((res) => setData(res.data.data));
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="surface-card overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {['ID', 'Enquiry', 'Mobile', 'Status', 'Provider ID', 'Failure', 'Sent', ''].map((h) => (
              <th key={h} className="px-3 py-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.items.map((w) => (
            <tr key={w.id} className="border-t">
              <td className="px-3 py-2">{w.id}</td>
              <td className="px-3 py-2">{w.enquiry_id || '—'}</td>
              <td className="px-3 py-2">{w.mobile}</td>
              <td className="px-3 py-2">
                <StatusBadge status={w.message_status} />
              </td>
              <td className="px-3 py-2">{w.provider_message_id || '—'}</td>
              <td className="px-3 py-2">{w.failure_reason || '—'}</td>
              <td className="px-3 py-2">{w.sent_at ? new Date(w.sent_at).toLocaleString('en-IN') : '—'}</td>
              <td className="px-3 py-2">
                <button
                  className="text-brand-500"
                  onClick={async () => {
                    await svc.retryWhatsapp(w.id);
                    toast.push('Retry sent');
                    load();
                  }}
                >
                  Retry
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect, useState } from 'react';
import * as svc from '../../services/enquiryService.js';

export default function AuditLogsPage() {
  const [data, setData] = useState({ items: [] });
  useEffect(() => {
    svc.listAudit({ limit: 50 }).then((res) => setData(res.data.data));
  }, []);
  return (
    <div className="surface-card overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {['Time', 'User', 'Action', 'Entity', 'IP'].map((h) => (
              <th key={h} className="px-3 py-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.items.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="px-3 py-2">{new Date(a.created_at).toLocaleString('en-IN')}</td>
              <td className="px-3 py-2">{a.user?.name || 'System'}</td>
              <td className="px-3 py-2">{a.action}</td>
              <td className="px-3 py-2">
                {a.entity_type} {a.entity_id || ''}
              </td>
              <td className="px-3 py-2">{a.ip_address || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

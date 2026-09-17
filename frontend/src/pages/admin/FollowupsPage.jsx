import { useEffect, useState } from 'react';
import * as svc from '../../services/enquiryService.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import { FOLLOWUP_STATUSES } from '../../constants/index.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function FollowupsPage() {
  const toast = useToast();
  const [bucket, setBucket] = useState('today');
  const [items, setItems] = useState([]);

  const load = () =>
    svc.listFollowups({ bucket, limit: 50 }).then((res) => setItems(res.data.data.items));

  useEffect(() => {
    load();
  }, [bucket]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['today', 'upcoming', 'overdue'].map((b) => (
          <button
            key={b}
            onClick={() => setBucket(b)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${bucket === b ? 'bg-brand-500 text-white shadow-glow' : 'bg-white text-brand-700 ring-1 ring-brand-100'}`}
          >
            {b}
          </button>
        ))}
      </div>
      <div className="surface-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {['Enquiry', 'Customer', 'Date', 'Time', 'Assigned', 'Status', 'Actions'].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="px-3 py-2">{f.enquiry?.enquiry_number}</td>
                <td className="px-3 py-2">{f.enquiry?.customer?.customer_name}</td>
                <td className="px-3 py-2">{f.followup_date}</td>
                <td className="px-3 py-2">{f.followup_time}</td>
                <td className="px-3 py-2">{f.assignee?.name}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={f.status} />
                </td>
                <td className="px-3 py-2">
                  <select
                    className="rounded border text-xs"
                    value={f.status}
                    onChange={async (e) => {
                      await svc.updateFollowupStatus(f.id, { status: e.target.value });
                      toast.push('Updated');
                      load();
                    }}
                  >
                    {FOLLOWUP_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

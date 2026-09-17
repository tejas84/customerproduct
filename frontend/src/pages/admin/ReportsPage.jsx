import { useEffect, useState } from 'react';
import * as svc from '../../services/enquiryService.js';
import api from '../../services/api.js';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function ReportsPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [groupBy, setGroupBy] = useState('status');
  const [rows, setRows] = useState([]);
  const [conversion, setConversion] = useState(null);

  const load = () => {
    svc.getReport({ from, to, groupBy }).then((res) => setRows(res.data.data));
    svc.getConversion({ from, to }).then((res) => setConversion(res.data.data));
  };

  useEffect(() => {
    load();
  }, [groupBy]);

  const exportCsv = async () => {
    const res = await api.get('/reports/enquiries/export', { params: { from, to }, responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enquiries.csv';
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="surface-card flex flex-wrap gap-2 p-4">
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="text-sm" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="text-sm" />
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="text-sm">
          <option value="day">Daily</option>
          <option value="status">Status-wise</option>
          <option value="type">Business type</option>
          <option value="product">Product-wise</option>
          <option value="employee">Employee-wise</option>
          <option value="source">Source-wise</option>
        </select>
        <button onClick={load} className="btn-primary">
          Apply
        </button>
        <button onClick={exportCsv} className="btn-secondary">
          Export CSV
        </button>
      </div>
      {conversion ? (
        <div className="grid gap-3 sm:grid-cols-4">
          {Object.entries(conversion).map(([k, v]) => (
            <div key={k} className="surface-card p-4">
              <p className="text-xs font-semibold uppercase text-brand-500">{k}</p>
              <p className="text-xl font-semibold">{v}</p>
            </div>
          ))}
        </div>
      ) : null}
      <div className="surface-card p-4">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

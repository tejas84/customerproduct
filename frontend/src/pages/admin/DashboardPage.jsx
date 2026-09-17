import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import * as svc from '../../services/enquiryService.js';
import Skeleton from '../../components/Skeleton.jsx';

const COLORS = ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#38bdf8', '#0ea5e9', '#1d4ed8', '#1e40af'];

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [status, setStatus] = useState([]);
  const [types, setTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      svc.getDashboardSummary(),
      svc.getTrend(),
      svc.getStatusSummary(),
      svc.getTypeSummary(),
      svc.getProductSummary(),
      svc.getMonthlyTrend(),
    ])
      .then(([s, t, st, ty, p, m]) => {
        setSummary(s.data.data);
        setTrend(t.data.data);
        setStatus(st.data.data);
        setTypes(ty.data.data);
        setProducts(p.data.data);
        setMonthly(m.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  if (error) return <p className="text-rose-600">{error}</p>;
  if (!summary) return <Skeleton className="h-64" />;

  const cards = [
    ['Total Enquiries', summary.totalEnquiries],
    ["Today's Enquiries", summary.todayEnquiries],
    ["This Week's Enquiries", summary.weekEnquiries],
    ["This Month's Enquiries", summary.monthEnquiries],
    ['New Enquiries', summary.newEnquiries],
    ['Assigned Enquiries', summary.assignedEnquiries],
    ['Follow-ups', summary.followUps],
    ['In Progress', summary.inProgress],
    ['Converted', summary.converted],
    ['Closed', summary.closed],
    ['Conversion Rate', `${summary.conversionRate}%`],
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-400 to-blue-400 p-6 text-white shadow-sm">
        <p className="text-sm text-sky-50">Live snapshot</p>
        <h2 className="mt-1 text-2xl font-bold">Enquiry dashboard</h2>
        <p className="mt-1 text-sm text-sky-50">Track new leads, conversions, and follow-ups in one place.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value], i) => (
          <div
            key={label}
            className={`rounded-2xl border border-sky-100 p-4 shadow-sm ${i === 0 ? 'bg-sky-100' : 'bg-white'}`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wide ${i === 0 ? 'text-sky-700' : 'text-sky-600'}`}>{label}</p>
            <p className="mt-2 text-2xl font-bold text-blue-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Enquiries by day">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Enquiries by status">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={status} dataKey="count" nameKey="name" outerRadius={90} label>
                {status.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Enquiries by business type">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={types}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Enquiries by product/service">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={products}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Monthly enquiry trend" wide>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#1d4ed8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children, wide }) {
  return (
    <div className={`surface-card p-4 ${wide ? 'lg:col-span-2' : ''}`}>
      <h3 className="mb-3 font-semibold text-brand-900">{title}</h3>
      {children}
    </div>
  );
}

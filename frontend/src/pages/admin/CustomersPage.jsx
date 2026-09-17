import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as svc from '../../services/enquiryService.js';
import Pagination from '../../components/Pagination.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function CustomersPage() {
  const [q, setQ] = useState('');
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });

  const load = (page = 1) => svc.listCustomers({ search: q, page, limit: 10 }).then((res) => setData(res.data.data));

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(1);
        }}
        className="flex gap-2"
      >
        <input className="flex-1" placeholder="Search name, mobile, email" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn-primary">Search</button>
      </form>
      <div className="surface-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {['Name', 'Mobile', 'Email', 'City', 'Created', ''].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2">{c.customer_name}</td>
                <td className="px-3 py-2">{c.mobile}</td>
                <td className="px-3 py-2">{c.email || '—'}</td>
                <td className="px-3 py-2">{c.city || '—'}</td>
                <td className="px-3 py-2">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                <td className="px-3 py-2">
                  <Link className="font-semibold text-brand-600" to={`/admin/customers/${c.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data.items.length ? <EmptyState title="No customers yet" /> : null}
      </div>
      <Pagination page={data.page} pages={data.pages} onChange={load} />
    </div>
  );
}

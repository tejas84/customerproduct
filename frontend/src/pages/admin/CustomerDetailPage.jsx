import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as svc from '../../services/enquiryService.js';
import StatusBadge from '../../components/StatusBadge.jsx';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  useEffect(() => {
    svc.getCustomer(id).then((res) => setCustomer(res.data.data));
  }, [id]);
  if (!customer) return <p>Loading…</p>;
  return (
    <div className="space-y-4">
      <section className="surface-card p-5">
        <h2 className="font-semibold">{customer.customer_name}</h2>
        <p className="text-sm text-slate-600">{customer.mobile} · {customer.email || 'No email'}</p>
        <p className="text-sm">{customer.address} {customer.city}</p>
        <p className="mt-2 text-sm">Total enquiries: {customer.total_enquiries}</p>
        <p className="text-xs text-slate-400">Created {new Date(customer.created_at).toLocaleString('en-IN')}</p>
      </section>
      <section className="surface-card p-5">
        <h3 className="mb-3 font-semibold">Enquiry history</h3>
        <ul className="space-y-2 text-sm">
          {(customer.enquiries || []).map((e) => (
            <li key={e.id} className="flex items-center justify-between border-b pb-2">
              <Link className="text-brand-500" to={`/admin/enquiries/${e.id}`}>
                {e.enquiry_number}
              </Link>
              <StatusBadge status={e.status} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

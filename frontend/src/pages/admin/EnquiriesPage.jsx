import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as svc from '../../services/enquiryService.js';
import { BUSINESS_TYPES, PRODUCTS_SERVICES, SOURCES, STATUSES } from '../../constants/index.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import Pagination from '../../components/Pagination.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Modal from '../../components/Modal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function EnquiriesPage() {
  const toast = useToast();
  const { hasRole } = useAuth();
  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    enquiry_type: '',
    product_service: '',
    source: '',
    from: '',
    to: '',
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  const [modal, setModal] = useState(null);
  const [users, setUsers] = useState([]);

  const load = () => {
    svc
      .listEnquiries(filters)
      .then((res) => setData(res.data.data))
      .catch((err) => toast.push(err.response?.data?.message || 'Failed to load', 'error'));
  };

  useEffect(() => {
    load();
  }, [filters.page, filters.status, filters.enquiry_type, filters.product_service, filters.source, filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    if (hasRole('SUPER_ADMIN', 'ADMIN')) {
      svc.listAssignableUsers().then((res) => setUsers(res.data.data)).catch(() => {});
    }
  }, []);

  const search = (e) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, page: 1 }));
    svc.listEnquiries({ ...filters, page: 1 }).then((res) => setData(res.data.data));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={search} className="surface-card grid gap-2 p-4 md:grid-cols-4">
        <input
          className="text-sm"
          placeholder="Search number, name, mobile, email"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select className="text-sm" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select className="text-sm" value={filters.enquiry_type} onChange={(e) => setFilters({ ...filters, enquiry_type: e.target.value, page: 1 })}>
          <option value="">All business types</option>
          {BUSINESS_TYPES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select className="text-sm" value={filters.product_service} onChange={(e) => setFilters({ ...filters, product_service: e.target.value, page: 1 })}>
          <option value="">All products</option>
          {PRODUCTS_SERVICES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select className="text-sm" value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value, page: 1 })}>
          <option value="">All sources</option>
          {SOURCES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <input type="date" className="text-sm" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
        <input type="date" className="text-sm" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
        <button className="btn-primary">Search</button>
      </form>

      <div className="surface-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {['Enquiry Number', 'Customer', 'Mobile', 'Business Type', 'Product/Service', 'Status', 'Assigned To', 'Created', 'Actions'].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((row) => (
              <tr key={row.id}>
                <td className="font-semibold text-brand-800">{row.enquiry_number}</td>
                <td>{row.customer?.customer_name}</td>
                <td>{row.customer?.mobile}</td>
                <td>{row.enquiry_type}</td>
                <td>{row.product_service}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>{row.assignee?.name || '—'}</td>
                <td>{new Date(row.created_at).toLocaleDateString('en-IN')}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <Link className="font-semibold text-brand-600 hover:text-brand-800" to={`/admin/enquiries/${row.id}`}>
                      View
                    </Link>
                    {hasRole('SUPER_ADMIN', 'ADMIN') ? (
                      <button className="text-slate-500 hover:text-brand-700" onClick={() => setModal({ type: 'assign', row })}>
                        Assign
                      </button>
                    ) : null}
                    <button className="text-slate-500 hover:text-brand-700" onClick={() => setModal({ type: 'status', row })}>
                      Status
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data.items.length ? <EmptyState title="No enquiries found" hint="Try adjusting filters." /> : null}
      </div>
      <Pagination page={data.page} pages={data.pages} onChange={(p) => setFilters({ ...filters, page: p })} />

      {modal?.type === 'assign' ? (
        <Modal title="Assign enquiry" onClose={() => setModal(null)}>
          <AssignForm
            users={users}
            onSubmit={async (assigned_to) => {
              await svc.assignEnquiry(modal.row.id, { assigned_to });
              toast.push('Enquiry assigned');
              setModal(null);
              load();
            }}
          />
        </Modal>
      ) : null}
      {modal?.type === 'status' ? (
        <Modal title="Change status" onClose={() => setModal(null)}>
          <StatusForm
            onSubmit={async (payload) => {
              await svc.changeStatus(modal.row.id, payload);
              toast.push('Status updated');
              setModal(null);
              load();
            }}
          />
        </Modal>
      ) : null}
    </div>
  );
}

function AssignForm({ users, onSubmit }) {
  const [id, setId] = useState(users[0]?.id || '');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(id);
      }}
      className="space-y-3"
    >
      <select className="w-full" value={id} onChange={(e) => setId(e.target.value)}>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.role?.name})
          </option>
        ))}
      </select>
      <button className="btn-primary">Assign</button>
    </form>
  );
}

function StatusForm({ onSubmit }) {
  const [status, setStatus] = useState('CONTACTED');
  const [remark, setRemark] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ status, remark });
      }}
      className="space-y-3"
    >
      <select className="w-full" value={status} onChange={(e) => setStatus(e.target.value)}>
        {STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <textarea className="w-full" placeholder="Remark" value={remark} onChange={(e) => setRemark(e.target.value)} />
      <button className="btn-primary">Update</button>
    </form>
  );
}

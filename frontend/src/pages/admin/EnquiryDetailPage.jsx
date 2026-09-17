import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as svc from '../../services/enquiryService.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import Modal from '../../components/Modal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { STATUSES } from '../../constants/index.js';

export default function EnquiryDetailPage() {
  const { id } = useParams();
  const toast = useToast();
  const { hasRole } = useAuth();
  const [enquiry, setEnquiry] = useState(null);
  const [modal, setModal] = useState(null);
  const [users, setUsers] = useState([]);

  const load = () => svc.getEnquiry(id).then((res) => setEnquiry(res.data.data));

  useEffect(() => {
    load().catch((err) => toast.push(err.response?.data?.message || 'Failed to load', 'error'));
    if (hasRole('SUPER_ADMIN', 'ADMIN')) {
      svc.listAssignableUsers().then((res) => setUsers(res.data.data)).catch(() => {});
    }
  }, [id]);

  if (!enquiry) return <p>Loading…</p>;
  const c = enquiry.customer || {};

  async function downloadPdf() {
    const res = await svc.downloadConfirmation(enquiry.id);
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${enquiry.enquiry_number}.pdf`;
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button className="btn-primary px-3 py-1.5" onClick={() => setModal('status')}>
          Change status
        </button>
        {hasRole('SUPER_ADMIN', 'ADMIN') ? (
          <button className="btn-secondary px-3 py-1.5" onClick={() => setModal('assign')}>
            Assign
          </button>
        ) : null}
        <button className="btn-secondary px-3 py-1.5" onClick={() => setModal('remark')}>
          Add remark
        </button>
        <button className="btn-secondary px-3 py-1.5" onClick={() => setModal('followup')}>
          Schedule follow-up
        </button>
        <button className="btn-secondary px-3 py-1.5" onClick={downloadPdf}>
          Download confirmation
        </button>
        {hasRole('SUPER_ADMIN', 'ADMIN') ? (
          <button
            className="btn-secondary px-3 py-1.5"
            onClick={async () => {
              await svc.sendWhatsapp({ enquiry_id: enquiry.id });
              toast.push('WhatsApp send attempted');
              load();
            }}
          >
            Resend WhatsApp
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="mb-3 font-semibold text-brand-900">Customer details</h2>
          <Row label="Name" value={c.customer_name} />
          <Row label="Mobile" value={c.mobile} />
          <Row label="Email" value={c.email || '—'} />
          <Row label="Address" value={c.address || '—'} />
          <Row label="City" value={c.city || '—'} />
        </section>
        <section className="surface-card p-5">
          <h2 className="mb-3 font-semibold text-brand-900">Enquiry details</h2>
          <Row label="Number" value={enquiry.enquiry_number} />
          <Row label="Business type" value={enquiry.enquiry_type} />
          <Row label="Product/Service" value={enquiry.product_service} />
          <Row label="Source" value={enquiry.source} />
          <Row label="Status" value={<StatusBadge status={enquiry.status} />} />
          <Row label="Assigned" value={enquiry.assignee?.name || '—'} />
          <Row label="Created" value={new Date(enquiry.created_at).toLocaleString('en-IN')} />
          <Row label="Updated" value={new Date(enquiry.updated_at).toLocaleString('en-IN')} />
          <p className="mt-3 text-sm text-slate-700">{enquiry.description}</p>
        </section>
      </div>

      <section className="surface-card p-5">
        <h2 className="mb-3 font-semibold text-brand-900">Activity timeline</h2>
        <ol className="space-y-3">
          {(enquiry.statusHistory || []).map((h) => (
            <li key={h.id} className="border-l-2 border-brand-500 pl-3 text-sm">
              <p className="font-medium">
                {h.old_status || '—'} → {h.new_status}
              </p>
              <p className="text-slate-600">{h.remark}</p>
              <p className="text-xs text-slate-400">
                {h.changedByUser?.name || 'System'} · {new Date(h.created_at).toLocaleString('en-IN')}
              </p>
            </li>
          ))}
          {(enquiry.whatsappMessages || []).map((w) => (
            <li key={`w-${w.id}`} className="border-l-2 border-emerald-500 pl-3 text-sm">
              WhatsApp {w.message_status} to {w.mobile}
            </li>
          ))}
        </ol>
      </section>

      {modal === 'status' ? (
        <Modal title="Change status" onClose={() => setModal(null)}>
          <SimpleSelect
            options={STATUSES}
            onSave={async (status, remark) => {
              await svc.changeStatus(enquiry.id, { status, remark });
              toast.push('Updated');
              setModal(null);
              load();
            }}
          />
        </Modal>
      ) : null}
      {modal === 'assign' ? (
        <Modal title="Assign" onClose={() => setModal(null)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const assigned_to = e.target.user.value;
              await svc.assignEnquiry(enquiry.id, { assigned_to });
              toast.push('Assigned');
              setModal(null);
              load();
            }}
          >
            <select name="user" className="w-full rounded border px-3 py-2">
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <button className="btn-primary mt-3">Save</button>
          </form>
        </Modal>
      ) : null}
      {modal === 'remark' ? (
        <Modal title="Add remark" onClose={() => setModal(null)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await svc.addRemark(enquiry.id, { remark: e.target.remark.value });
              toast.push('Remark added');
              setModal(null);
              load();
            }}
          >
            <textarea name="remark" className="w-full rounded border px-3 py-2" required minLength={2} />
            <button className="btn-primary mt-3">Save</button>
          </form>
        </Modal>
      ) : null}
      {modal === 'followup' ? (
        <Modal title="Schedule follow-up" onClose={() => setModal(null)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              await svc.createFollowup({
                enquiry_id: enquiry.id,
                assigned_to: fd.get('assigned_to') || enquiry.assigned_to,
                followup_date: fd.get('followup_date'),
                followup_time: fd.get('followup_time'),
                remark: fd.get('remark'),
              });
              toast.push('Follow-up created');
              setModal(null);
              load();
            }}
          >
            <select name="assigned_to" className="mb-2 w-full rounded border px-3 py-2" defaultValue={enquiry.assigned_to || ''}>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <input name="followup_date" type="date" required className="mb-2 w-full rounded border px-3 py-2" />
            <input name="followup_time" type="time" required className="mb-2 w-full rounded border px-3 py-2" />
            <textarea name="remark" className="w-full rounded border px-3 py-2" />
            <button className="btn-primary mt-3">Save</button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-brand-500">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function SimpleSelect({ options, onSave }) {
  const [status, setStatus] = useState(options[0]);
  const [remark, setRemark] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(status, remark);
      }}
    >
      <select className="w-full rounded border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <textarea className="mt-2 w-full rounded border px-3 py-2" value={remark} onChange={(e) => setRemark(e.target.value)} />
      <button className="btn-primary mt-3">Save</button>
    </form>
  );
}

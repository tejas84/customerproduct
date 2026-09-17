export default function StatusBadge({ status }) {
  const map = {
    NEW: 'bg-brand-100 text-brand-800',
    ASSIGNED: 'bg-sky-100 text-sky-800',
    CONTACTED: 'bg-blue-100 text-blue-800',
    FOLLOW_UP: 'bg-amber-100 text-amber-800',
    IN_PROGRESS: 'bg-violet-100 text-violet-800',
    CONVERTED: 'bg-emerald-100 text-emerald-800',
    CLOSED: 'bg-slate-200 text-slate-700',
    REJECTED: 'bg-rose-100 text-rose-800',
    PENDING: 'bg-amber-100 text-amber-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    MISSED: 'bg-rose-100 text-rose-800',
    CANCELLED: 'bg-slate-200 text-slate-700',
    SENT: 'bg-emerald-100 text-emerald-800',
    DELIVERED: 'bg-green-100 text-green-800',
    FAILED: 'bg-rose-100 text-rose-800',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
}

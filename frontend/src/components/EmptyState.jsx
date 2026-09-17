export default function EmptyState({ title, hint }) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 p-10 text-center text-slate-500">
      <p className="font-semibold text-brand-800">{title}</p>
      {hint ? <p className="mt-1 text-sm">{hint}</p> : null}
    </div>
  );
}

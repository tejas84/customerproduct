export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-brand-900/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between border-b border-brand-50 pb-3">
          <h3 className="text-lg font-bold text-brand-900">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-slate-500 hover:bg-brand-50 hover:text-brand-800">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

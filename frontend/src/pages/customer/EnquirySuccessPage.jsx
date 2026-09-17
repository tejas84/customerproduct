import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function EnquirySuccessPage() {
  const { state } = useLocation();
  if (!state?.enquiry_number) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-blue-800 to-sky-500 px-4">
        <div className="rounded-3xl bg-white p-8 text-center shadow-card">
          <p>No enquiry to display.</p>
          <Link className="mt-4 inline-block font-semibold text-brand-600" to="/enquiry">
            Submit an enquiry
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-blue-800 to-sky-500 px-4 py-12">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white text-center shadow-card">
        <div className="bg-gradient-to-r from-brand-700 to-brand-500 px-6 py-8 text-white">
          <CheckCircle2 className="mx-auto mb-3" size={52} />
          <h1 className="text-2xl font-bold">Enquiry submitted</h1>
          <p className="mt-1 text-sm text-blue-100">Your enquiry has been submitted successfully.</p>
        </div>
        <div className="p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Enquiry Number</p>
          <p className="mt-1 text-3xl font-extrabold tracking-wide text-brand-700">{state.enquiry_number}</p>
          <p className="mt-2 text-sm text-slate-500">
            Submitted {state.submitted_at ? new Date(state.submitted_at).toLocaleString('en-IN') : ''}
          </p>
          <p className="mt-4 text-slate-700">Our team will contact you shortly.</p>
          {state.whatsapp ? (
            <p className="mt-4 rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-800">
              WhatsApp confirmation: <strong>{state.whatsapp.status}</strong>
              {state.whatsapp.failure_reason ? ` — ${state.whatsapp.failure_reason}` : ''}
            </p>
          ) : null}
          <Link to="/enquiry" className="btn-primary mt-8 inline-block px-6 py-3">
            Submit another enquiry
          </Link>
        </div>
      </div>
    </div>
  );
}

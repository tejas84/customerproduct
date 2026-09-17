import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { enquiryFormSchema } from '../../validations/enquiry.js';
import { CONTACT_METHODS, BUSINESS_TYPES } from '../../constants/index.js';
import { submitEnquiry } from '../../services/enquiryService.js';
import { useState } from 'react';
import { Building2, ClipboardList, Mail, MapPin, MessageSquare, Phone, QrCode, Send } from 'lucide-react';

export default function EnquiryFormPage() {
  const [searchParams] = useSearchParams();
  const source = (searchParams.get('source') || 'website').toUpperCase();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      preferred_contact_method: 'WHATSAPP',
    },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const res = await submitEnquiry({ ...values, source });
      const data = res.data.data;
      navigate('/enquiry/success', {
        state: {
          enquiry_number: data.enquiry_number,
          submitted_at: data.submitted_at,
          whatsapp: data.whatsapp,
          message: res.data.message,
        },
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not submit enquiry. Please try again.';
      const details = err.response?.data?.errors?.map((e) => e.message).join(' ');
      setServerError(details ? `${msg}: ${details}` : msg);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-sky-500 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <div className="mb-8 text-center text-white">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
            <ClipboardList size={14} /> Customer Portal
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">Share your enquiry</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-blue-100">
            Tell us about your requirement. Our team will get back to you shortly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-hidden rounded-3xl bg-white shadow-card"
          noValidate
        >
          <div className="bg-gradient-to-r from-brand-700 to-brand-500 px-6 py-4 text-white">
            <p className="text-sm font-medium">Enquiry details</p>
            <p className="text-xs text-blue-100">Fields marked * are required</p>
          </div>

          <div className="space-y-4 p-6 md:p-8">
            {source === 'QR' ? (
              <p className="inline-flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
                <QrCode size={14} /> Opened from QR code
              </p>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name *" error={errors.customer_name?.message}>
                <input className="w-full" {...register('customer_name')} autoComplete="name" placeholder="Your full name" />
              </Field>
              <Field label="Mobile number *" error={errors.mobile?.message}>
                <div className="has-leading-icon">
                  <Phone className="leading-icon" />
                  <input className="w-full" inputMode="numeric" {...register('mobile')} autoComplete="tel" placeholder="10-digit mobile" />
                </div>
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <div className="has-leading-icon">
                  <Mail className="leading-icon" />
                  <input className="w-full" type="email" {...register('email')} autoComplete="email" placeholder="you@example.com" />
                </div>
              </Field>
              <Field label="City" error={errors.city?.message}>
                <div className="has-leading-icon">
                  <MapPin className="leading-icon" />
                  <input className="w-full" {...register('city')} placeholder="City" />
                </div>
              </Field>
              <Field label="Address" error={errors.address?.message} className="md:col-span-2">
                <input className="w-full" {...register('address')} placeholder="Street, area, landmark" />
              </Field>
              <Field label="Business type *" error={errors.enquiry_type?.message}>
                <div className="has-leading-icon">
                  <Building2 className="leading-icon" />
                  <select className="w-full" {...register('enquiry_type')}>
                    <option value="">Select business type</option>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>
              <Field label="Preferred contact method" error={errors.preferred_contact_method?.message}>
                <div className="has-leading-icon">
                  <MessageSquare className="leading-icon" />
                  <select className="w-full" {...register('preferred_contact_method')}>
                    <option value="">Select</option>
                    {CONTACT_METHODS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>
              <Field label="Description *" error={errors.description?.message} className="md:col-span-2">
                <textarea className="min-h-28 w-full" {...register('description')} placeholder="Describe your enquiry in a few lines" />
              </Field>
            </div>

            {serverError ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{serverError}</p> : null}

            <button type="submit" disabled={isSubmitting} className="btn-primary flex w-full items-center justify-center gap-2 py-3 text-base">
              <Send size={16} />
              {isSubmitting ? 'Submitting…' : 'Submit enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}

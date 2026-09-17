import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../validations/enquiry.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useState } from 'react';
import { Lock, Shield } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    setError('');
    try {
      await login(values);
      const dest = location.state?.from?.pathname || '/admin/dashboard';
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-blue-100 to-sky-200 px-4">
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl" />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-card">
        <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-8 py-6 text-white">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
            <Shield size={22} />
          </div>
          <h1 className="text-2xl font-bold">Admin login</h1>
          <p className="mt-1 text-sm text-blue-100">Sign in to manage customer enquiries</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          <label className="block text-sm font-semibold text-slate-700">Email</label>
          <input className="mt-1.5 w-full" type="email" {...register('email')} placeholder="admin@example.com" />
          {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
          <label className="mt-4 block text-sm font-semibold text-slate-700">Password</label>
          <div className="has-leading-icon mt-1.5">
            <Lock className="leading-icon" />
            <input className="w-full" type="password" {...register('password')} placeholder="••••••••" />
          </div>
          {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}
          {error ? <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p> : null}
          <button disabled={isSubmitting} className="btn-primary mt-6 w-full py-3">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

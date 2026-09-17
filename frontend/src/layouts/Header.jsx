import { useAuth } from '../context/AuthContext.jsx';

export default function Header({ title }) {
  const { user } = useAuth();
  const initials = (user?.name || 'A')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-sky-100 bg-white px-6 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Workspace</p>
        <h1 className="text-xl font-bold text-blue-900">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right text-sm">
          <p className="font-semibold text-slate-800">{user?.name}</p>
          <p className="text-xs font-medium text-sky-600">{user?.role}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-200 text-xs font-bold text-blue-800">
          {initials}
        </div>
      </div>
    </header>
  );
}

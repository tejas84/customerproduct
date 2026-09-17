import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  CalendarClock,
  BarChart3,
  MessageCircle,
  Shield,
  ScrollText,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const items = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
  { to: '/admin/enquiries', label: 'Enquiries', icon: ClipboardList, roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
  { to: '/admin/customers', label: 'Customers', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
  { to: '/admin/followups', label: 'Follow-ups', icon: CalendarClock, roles: ['SUPER_ADMIN', 'ADMIN', 'STAFF'] },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { to: '/admin/whatsapp', label: 'WhatsApp Logs', icon: MessageCircle, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { to: '/admin/users', label: 'Users', icon: Shield, roles: ['SUPER_ADMIN'] },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText, roles: ['SUPER_ADMIN'] },
  { to: '/admin/settings', label: 'Settings', icon: Settings, roles: ['SUPER_ADMIN', 'ADMIN'] },
];

export default function Sidebar({ compact = false }) {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const links = items.filter((i) => hasRole(...i.roles));

  if (compact) {
    return (
      <nav className="flex gap-2 overflow-x-auto border-b border-sky-100 bg-sky-50 p-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium ${
                isActive ? 'bg-blue-500 text-white' : 'text-blue-800 hover:bg-sky-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    );
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sky-100 bg-sky-50 text-slate-700">
      <div className="border-b border-sky-100 px-5 py-6">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-700">
          ED
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-sky-600">Admin Panel</p>
        <p className="text-lg font-semibold text-blue-900">Enquiry Desk</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                isActive
                  ? 'bg-blue-500 font-semibold text-white shadow-sm'
                  : 'text-slate-600 hover:bg-sky-100 hover:text-blue-800'
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        onClick={async () => {
          await logout();
          navigate('/admin/login');
        }}
        className="flex items-center gap-2 border-t border-sky-100 px-5 py-4 text-sm text-blue-700 hover:bg-sky-100"
      >
        <LogOut size={16} /> Logout {user ? `(${user.name})` : ''}
      </button>
    </aside>
  );
}

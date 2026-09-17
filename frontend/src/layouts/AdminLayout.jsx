import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

const titles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/enquiries': 'Enquiries',
  '/admin/customers': 'Customers',
  '/admin/followups': 'Follow-ups',
  '/admin/reports': 'Reports',
  '/admin/whatsapp': 'WhatsApp Logs',
  '/admin/users': 'Users',
  '/admin/audit-logs': 'Audit Logs',
  '/admin/settings': 'Settings',
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  const title =
    Object.entries(titles).find(([key]) => pathname === key || pathname.startsWith(`${key}/`))?.[1] ||
    'Admin';

  return (
    <div className="flex min-h-screen bg-sky-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} />
        <div className="md:hidden">
          <Sidebar compact />
        </div>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

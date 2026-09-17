import { Navigate, Route, Routes } from 'react-router-dom';
import EnquiryFormPage from './pages/customer/EnquiryFormPage.jsx';
import EnquirySuccessPage from './pages/customer/EnquirySuccessPage.jsx';
import LoginPage from './pages/admin/LoginPage.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';
import EnquiriesPage from './pages/admin/EnquiriesPage.jsx';
import EnquiryDetailPage from './pages/admin/EnquiryDetailPage.jsx';
import CustomersPage from './pages/admin/CustomersPage.jsx';
import CustomerDetailPage from './pages/admin/CustomerDetailPage.jsx';
import FollowupsPage from './pages/admin/FollowupsPage.jsx';
import ReportsPage from './pages/admin/ReportsPage.jsx';
import WhatsappPage from './pages/admin/WhatsappPage.jsx';
import UsersPage from './pages/admin/UsersPage.jsx';
import AuditLogsPage from './pages/admin/AuditLogsPage.jsx';
import SettingsPage from './pages/admin/SettingsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/enquiry" replace />} />
      <Route path="/enquiry" element={<EnquiryFormPage />} />
      <Route path="/enquiry/success" element={<EnquirySuccessPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="enquiries" element={<EnquiriesPage />} />
          <Route path="enquiries/:id" element={<EnquiryDetailPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="followups" element={<FollowupsPage />} />
          <Route element={<ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']} />}>
            <Route path="reports" element={<ReportsPage />} />
            <Route path="whatsapp" element={<WhatsappPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={['SUPER_ADMIN']} />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/enquiry" replace />} />
    </Routes>
  );
}

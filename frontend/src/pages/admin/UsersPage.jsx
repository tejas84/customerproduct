import { useEffect, useState } from 'react';
import * as svc from '../../services/enquiryService.js';
import Modal from '../../components/Modal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ROLES } from '../../constants/index.js';

export default function UsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const load = () => svc.listUsers().then((res) => setUsers(res.data.data));
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <button className="btn-primary" onClick={() => setOpen(true)}>
        Create user
      </button>
      <div className="surface-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {['Name', 'Email', 'Role', 'Active', 'Actions'].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.role?.name}</td>
                <td className="px-3 py-2">{u.is_active ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2 space-x-2">
                  <button
                    className="text-brand-500"
                    onClick={async () => {
                      await svc.setUserStatus(u.id, { is_active: !u.is_active });
                      toast.push('Status updated');
                      load();
                    }}
                  >
                    {u.is_active ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open ? (
        <Modal title="Create user" onClose={() => setOpen(false)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              await svc.createUser({
                name: fd.get('name'),
                email: fd.get('email'),
                password: fd.get('password'),
                role: fd.get('role'),
              });
              toast.push('User created');
              setOpen(false);
              load();
            }}
            className="space-y-2"
          >
            <input name="name" required placeholder="Name" className="w-full rounded border px-3 py-2" />
            <input name="email" type="email" required placeholder="Email" className="w-full rounded border px-3 py-2" />
            <input name="password" type="password" required minLength={8} placeholder="Temporary password" className="w-full rounded border px-3 py-2" />
            <select name="role" className="w-full rounded border px-3 py-2">
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <button className="btn-primary">Save</button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

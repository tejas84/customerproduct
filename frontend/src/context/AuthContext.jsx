import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as svc from '../services/enquiryService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cems_token');
    if (!token) {
      setLoading(false);
      return;
    }
    svc
      .me()
      .then((res) => setUser(res.data.data))
      .catch(() => {
        localStorage.removeItem('cems_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(credentials) {
        const res = await svc.login(credentials);
        localStorage.setItem('cems_token', res.data.data.token);
        setUser(res.data.data.user);
        return res.data.data.user;
      },
      async logout() {
        try {
          await svc.logout();
        } catch {
          /* ignore */
        }
        localStorage.removeItem('cems_token');
        setUser(null);
      },
      hasRole(...roles) {
        return user && roles.includes(user.role);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

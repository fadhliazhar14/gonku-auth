import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useAuthStore } from '../../hooks/useAuthStore';

export default function RootLayout() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchUserSession = useAuthStore((state) => state.fetchUserSession);

  useEffect(() => {
    if (!location.pathname.includes('/login')) {
      if (!isAuthenticated) {
        fetchUserSession();
      }
    }
  }, [fetchUserSession, location.pathname, isAuthenticated]);

  return <Outlet />;
}

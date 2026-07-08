import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useAuthStore } from '../../hooks/useAuthStore';

export default function RootLayout() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchUserSession = useAuthStore((state) => state.fetchUserSession);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!location.pathname.includes('/login') && !isAuthenticated && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchUserSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — session bootstrap runs once on mount

  return <Outlet />;
}

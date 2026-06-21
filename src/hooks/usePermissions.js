import { useLocation } from "react-router";
import { useAuth } from "../components/layout/AuthContext";
import { hasPermission } from "../libs/permission";

export function usePermissions() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  const checkPermission = (pathname) => {
    if (isLoading) return true;
    if (!user || !Array.isArray(user.roles)) return false;

    return user.roles.some(role => {
      const roleName = typeof role === 'string' ? role : role?.name;
      return hasPermission(roleName, pathname);
    });
  };

  const isAuthorized = checkPermission(location.pathname);

  return { isAuthorized, checkPermission };
}

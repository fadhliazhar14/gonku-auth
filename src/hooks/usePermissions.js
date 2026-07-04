import { useLocation } from "react-router";
import { useAuthStore } from "./useAuthStore";
import { hasPermission } from "../utils/permission";

export function usePermissions() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
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

import { useAuthStore } from "../../hooks/useAuthStore";
import { usePermissions } from "../../hooks/usePermissions";

export const useAppLayoutPresenter = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  const { isAuthorized } = usePermissions();

  return {
    user,
    isLoading,
    error: null,
    isAuthorized,
    logout
  };
};

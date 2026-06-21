import { useAuth } from "./AuthContext";
import { usePermissions } from "../../hooks/usePermissions";

export const useAppLayoutPresenter = () => {
  const { user, isLoading, logout } = useAuth();
  const { isAuthorized } = usePermissions();

  return {
    user,
    isLoading,
    error: null,
    isAuthorized,
    logout
  };
};
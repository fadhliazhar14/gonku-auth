/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router";
import { API_BASE_URL } from "../../libs/constants";
import { fetchWithAuth } from "../../libs/fetchWithAuth";
import { userSchema } from "../../types/user";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });
  const location = useLocation();

  const fetchUserSession = useCallback(async () => {
    try {
      const response = await fetchWithAuth(API_BASE_URL.AUTH + '/me');
      if (response.ok) {
        const data = await response.json();

        setAuthState({
          isAuthenticated: true,
          user: userSchema.safeParse(data.data.userData).data,
          isLoading: false,
        });
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      setAuthState({ isAuthenticated: false, user: null, isLoading: false });
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!location.pathname.includes('/login')) {
      if (!authState.isAuthenticated) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUserSession();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUserSession, location.pathname]);

  const logout = useCallback(async () => {
    try {
      await fetch(API_BASE_URL.AUTH + '/signout', {
        method: 'POST',
        credentials: 'same-origin'
      });
    } catch (error) {
      throw new Error("Logout failed : ", error);
    } finally {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
    }
  }, []);

  const setLoginSession = (userData) => {
    setAuthState({
      isAuthenticated: true,
      user: userData,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, setLoginSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
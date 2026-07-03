import { create } from 'zustand';
import { API_BASE_URL } from '../libs/constants';
import { fetchWithAuth } from '../libs/fetchWithAuth';
import { userSchema } from '../types/user';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  fetchUserSession: async () => {
    try {
      const response = await fetchWithAuth(API_BASE_URL.AUTH + '/me');
      if (response.ok) {
        const data = await response.json();
        const parsedUser = userSchema.safeParse(data.data.userData).data;
        set({
          isAuthenticated: true,
          user: parsedUser,
          isLoading: false,
        });
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      console.error(error);
    }
  },

  logout: async () => {
    try {
      await fetch(API_BASE_URL.AUTH + '/signout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch (error) {
      throw new Error("Logout failed", { cause: error });
    } finally {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  },

  setLoginSession: (userData) => {
    set({
      isAuthenticated: true,
      user: userData,
      isLoading: false,
    });
  },
}));

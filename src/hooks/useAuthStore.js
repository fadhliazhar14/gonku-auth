import { create } from 'zustand';
import api from '../libs/axios';
import { userSchema } from '../schemas/user.schema';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  fetchUserSession: async () => {
    try {
      const response = await api.get('/auth/me');
      const parsed = userSchema.safeParse(response.data.data.userData);
      if (!parsed.success) {
        set({ isAuthenticated: false, user: null, isLoading: false });
        return;
      }
      set({
        isAuthenticated: true,
        user: parsed.data,
        isLoading: false,
      });
    } catch (error) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      console.error(error);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/signout');
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

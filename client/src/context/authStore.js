import { create } from 'zustand';
import api, { getApiError } from '../services/api.js';

const TOKEN_KEY = 'language_hub_token';
const AUTH_FLAG_KEY = 'language_hub_logged_in';

const signedOutState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

function persistAuthSession(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  localStorage.setItem(AUTH_FLAG_KEY, 'true');
}

function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_FLAG_KEY);
}

const useAuthStore = create((set) => ({
  ...signedOutState,
  isLoading: true,
  error: null,

  async login(credentials) {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', credentials);
      const { user, token } = data.data;
      persistAuthSession(token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      clearAuthSession();
      const message = getApiError(error, 'Unable to sign in. Please try again.');
      set({ ...signedOutState, isLoading: false, error: message });
      return { success: false, message };
    }
  },

  async register(details) {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', details);
      const { user, token } = data.data;
      persistAuthSession(token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      clearAuthSession();
      const message = getApiError(error, 'Unable to create your account. Please try again.');
      set({ ...signedOutState, isLoading: false, error: message });
      return { success: false, message };
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout errors
    } finally {
      clearAuthSession();
      set({ ...signedOutState, isLoading: false, error: null });
    }
  },

  async checkAuth() {
    set({ isLoading: true, error: null });

    const hasStoredToken = localStorage.getItem(TOKEN_KEY);
    const hasAuthFlag = localStorage.getItem(AUTH_FLAG_KEY);

    // If user is not logged in, skip calling /auth/me to avoid 401 console error
    if (!hasStoredToken && !hasAuthFlag) {
      set({ ...signedOutState, isLoading: false });
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.data.user, token: hasStoredToken, isAuthenticated: true, isLoading: false });
    } catch {
      clearAuthSession();
      set({ ...signedOutState, isLoading: false });
    }
  },

  updateUser(userData) {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },

  clearError() {
    set({ error: null });
  },
}));

export default useAuthStore;

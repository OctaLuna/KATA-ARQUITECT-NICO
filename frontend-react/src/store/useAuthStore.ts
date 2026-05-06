import { create } from 'zustand';
import { AuthService } from '../api/authService';

interface AuthUser {
  username: string;
  fullName: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,

  restoreSession: () => {
    const token = localStorage.getItem('arca_token');
    const raw   = localStorage.getItem('arca_user');
    if (token && raw) {
      try {
        const user: AuthUser = JSON.parse(raw);
        set({ isAuthenticated: true, token, user });
      } catch {
        localStorage.removeItem('arca_token');
        localStorage.removeItem('arca_user');
      }
    }
  },

  login: async (username, password) => {
    const response = await AuthService.login(username, password);
    const { token, fullName, role } = response.data;
    const user: AuthUser = { username: response.data.username, fullName, role };

    localStorage.setItem('arca_token', token);
    localStorage.setItem('arca_user', JSON.stringify(user));

    set({ isAuthenticated: true, token, user });
    return true;
  },

  logout: () => {
    localStorage.removeItem('arca_token');
    localStorage.removeItem('arca_user');
    set({ isAuthenticated: false, token: null, user: null });
  },
}));

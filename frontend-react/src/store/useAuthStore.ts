import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string; name: string } | null;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (username, pass) => {
    // Simulated Microservice authentication
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === 'admin HR' && pass === '123456789') {
          set({ isAuthenticated: true, user: { username, name: 'Admin HR' } });
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  }
}));

import { authApi } from './axios';

export interface AuthResponse {
  token: string;
  username: string;
  fullName: string;
  role: string;
  expiresAt: string;
}

export interface UserDto {
  id: string;
  username: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export const AuthService = {
  login: (username: string, password: string) =>
    authApi.post<AuthResponse>('/api/auth/login', { username, password }),

  register: (username: string, password: string, fullName: string, role: string) =>
    authApi.post<AuthResponse>('/api/auth/register', { username, password, fullName, role }),

  me: () =>
    authApi.get<UserDto>('/api/auth/me'),

  getUsers: () =>
    authApi.get<UserDto[]>('/api/auth/users'),
};

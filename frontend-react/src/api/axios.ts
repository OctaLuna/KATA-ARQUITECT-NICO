import axios from 'axios';

// Shared interceptor: attaches JWT from localStorage to every request.
// Each service has its own axios instance (different baseURL) but all use
// this factory so the interceptors apply consistently.
function createClient(baseURL: string) {
  const client = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('arca_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('arca_token');
        localStorage.removeItem('arca_user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export const authApi     = createClient('http://localhost:5000');
export const employeeApi = createClient('http://localhost:5001');
export const vacationApi = createClient('http://localhost:5002');
export const contractApi = createClient('http://localhost:5003');
export const payrollApi  = createClient('http://localhost:5004');

import axios from 'axios';

export const vacationApi = axios.create({
  baseURL: 'http://localhost:5002/api/vacations',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface VacationBalance {
  id: string; // the guid from the vacation service database
  employeeId: string;
  managementYear: number;
  availableDays: number;
  usedDays: number;
  totalDays: number;
}

export const VacationService = {
  calculateBalances: async (): Promise<any> => {
    try {
      const response = await vacationApi.post('/calculate');
      return response.data;
    } catch (error) {
      console.warn("API de vacaciones no está corriendo en localhost:5002 o employee-service no está en localhost:5001");
      throw error;
    }
  },

  getAllBalances: async (): Promise<VacationBalance[]> => {
    try {
      const response = await vacationApi.get('');
      return response.data;
    } catch (error) {
      console.warn("Fallo al obtener saldos de vacaciones");
      throw error;
    }
  },

  getEmployeeBalance: async (employeeId: string): Promise<VacationBalance> => {
    try {
      const response = await vacationApi.get(`/${employeeId}`);
      return response.data;
    } catch (error) {
       console.warn("Fallo al obtener saldo individual de vacaciones");
       throw error;
    }
  },

  useVacationDays: async (employeeId: string, days: number): Promise<void> => {
    try {
      await vacationApi.put(`/${employeeId}/use`, { days });
    } catch (error) {
      console.warn("Fallo al utilizar días de vacaciones");
      throw error;
    }
  }
};

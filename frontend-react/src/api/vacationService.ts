import axios from 'axios';

export const vacationApi = axios.create({
  baseURL: 'http://localhost:5002/api/vacations',
  headers: { 'Content-Type': 'application/json' },
});

export interface VacationBalance {
  id: string;
  employeeId: string;
  employeeName: string;
  managementYear: number;
  totalDays: number;
  usedDays: number;
  availableDays: number;
  isEligible: boolean;
  calculatedAt: string;
}

export interface CalculationResult {
  managementYear: number;
  totalProcessed: number;
  newRecordsCreated: number;
  alreadyExisted: number;
  eligible: number;
  notEligible: number;
}

export const VacationService = {
  getAll: async (): Promise<VacationBalance[]> => {
    const response = await vacationApi.get('');
    return response.data;
  },

  getByEmployee: async (employeeId: string): Promise<VacationBalance> => {
    const response = await vacationApi.get(`/${employeeId}`);
    return response.data;
  },

  calculate: async (): Promise<CalculationResult> => {
    const response = await vacationApi.post('/calculate');
    return response.data;
  },

  useDays: async (employeeId: string, days: number): Promise<VacationBalance> => {
    const response = await vacationApi.put(`/${employeeId}/use`, { days });
    return response.data;
  },
};

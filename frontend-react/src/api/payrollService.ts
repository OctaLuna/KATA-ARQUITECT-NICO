import axios from 'axios';

// Configured specifically for the Payroll microservice
export const payrollApi = axios.create({
  baseURL: 'http://localhost:3004/api/payrolls',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Payroll {
  id?: string;
  employeeId: string;
  employeeName: string;
  period: string;
  baseSalary: number;
}

export const PayrollService = {
  getPayrolls: async (): Promise<Payroll[]> => {
    try {
      const response = await payrollApi.get('');
      return response.data;
    } catch (error) {
      console.warn("API de planillas no está corriendo en localhost:3004.");
      throw error;
    }
  },

  generatePayroll: async (payrollData: {
    employeeId: string;
    employeeName: string;
    period: string;
    baseSalary: number;
  }): Promise<Payroll> => {
    try {
      const response = await payrollApi.post('', payrollData);
      return response.data;
    } catch (error) {
      console.warn("Fallo al generar planilla en microservicio.");
      throw error;
    }
  }
};

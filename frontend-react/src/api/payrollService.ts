import { payrollApi } from './axios';

export interface BackendPayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeePosition: string;
  employeeArea: string;
  year: number;
  month: number;
  baseSalary: number;
  afpDiscount: number;
  netSalary: number;
  generatedAt: string;
}

export interface PayrollSummary {
  year: number;
  month: number;
  totalEmployees: number;
  newRecordsCreated: number;
  alreadyExisted: number;
  records: BackendPayrollRecord[];
}

export const PayrollService = {
  generate: (year: number, month: number) =>
    payrollApi.post<PayrollSummary>('/api/payroll/generate', { year, month }),

  getAll: () =>
    payrollApi.get<BackendPayrollRecord[]>('/api/payroll'),

  getByEmployee: (employeeId: string) =>
    payrollApi.get<BackendPayrollRecord[]>(`/api/payroll/employee/${employeeId}`),
};

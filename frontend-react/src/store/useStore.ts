import { create } from 'zustand';
import { EmployeeService } from '../api/employeeService';
import { PayrollService } from '../api/payrollService';

export interface Employee {
  id: string;
  fullName: string;
  ci: string;
  area: string;
  position: string;
  salary: number;
  entryDate: string; // ISO String
  status: boolean;
  vacationsBalance: number; // days – merged from vacation-service on load
}

export interface Contract {
  id: string;
  employeeId: string;
  startDate: string;
  salary: number;
  trialPeriod: number; // months
  generatedAt: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  employeePosition: string;
  employeeArea: string;
  month: number;
  year: number;
  baseSalary: number;
  afpDiscount: number;
  amount: number; // netSalary
  generatedAt: string;
}

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  employees: Employee[];
  loadEmployees: () => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  updateEmployeeLocal: (id: string, patch: Partial<Employee>) => void;
  deleteEmployee: (id: string) => Promise<void>;

  contracts: Contract[];
  addContract: (contract: Omit<Contract, 'id' | 'generatedAt'>) => Promise<Contract>;

  payslips: Payslip[];
  loadPayslips: () => Promise<void>;
  generatePayslips: (month: number, year: number) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  employees: [],

  loadEmployees: async () => {
    try {
      const data = await EmployeeService.getEmployees();
      set({ employees: data });
    } catch {
      // Backend unavailable – keep whatever is in state
    }
  },

  addEmployee: async (employee) => {
    try {
      const newEmployee = await EmployeeService.createEmployee(employee);
      set((state) => ({ employees: [...state.employees, newEmployee] }));
    } catch (e) {
      // Optimistic local fallback so UI stays usable
      set((state) => ({
        employees: [
          ...state.employees,
          { ...employee, id: crypto.randomUUID() },
        ],
      }));
      throw e;
    }
  },

  // Updates employee fields that the backend accepts (area, position, salary).
  // vacationsBalance is managed by vacation-service and handled locally via updateEmployeeLocal.
  updateEmployee: async (id, data) => {
    try {
      const updated = await EmployeeService.updateEmployee(id, data);
      set((state) => ({
        employees: state.employees.map((e) => (e.id === id ? { ...e, ...updated } : e)),
      }));
    } catch (e) {
      set((state) => ({
        employees: state.employees.map((e) => (e.id === id ? { ...e, ...data } : e)),
      }));
      throw e;
    }
  },

  // Applies a local-only patch without hitting the backend (used for vacationsBalance display)
  updateEmployeeLocal: (id, patch) => {
    set((state) => ({
      employees: state.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  },

  deleteEmployee: async (id) => {
    try {
      await EmployeeService.deleteEmployee(id);
    } catch (e) {
      throw e;
    } finally {
      set((state) => ({
        employees: state.employees.map((e) => (e.id === id ? { ...e, status: false } : e)),
      }));
    }
  },

  contracts: [],
  addContract: async (contractData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newContract: Contract = {
          ...contractData,
          id: crypto.randomUUID(),
          generatedAt: new Date().toISOString(),
        };
        set((state) => ({ contracts: [...state.contracts, newContract] }));
        resolve(newContract);
      }, 300);
    });
  },

  payslips: [],

  loadPayslips: async () => {
    try {
      const response = await PayrollService.getAll();
      const records = response.data;
      const payslips: Payslip[] = records.map((r) => ({
        id: r.id,
        employeeId: r.employeeId,
        employeeName: r.employeeName,
        employeePosition: r.employeePosition,
        employeeArea: r.employeeArea,
        month: r.month,
        year: r.year,
        baseSalary: r.baseSalary,
        afpDiscount: r.afpDiscount,
        amount: r.netSalary,
        generatedAt: r.generatedAt,
      }));
      set({ payslips });
    } catch {
      // Keep session state if backend unavailable
    }
  },

  generatePayslips: async (month, year) => {
    try {
      const { data } = await PayrollService.generate(year, month);
      const newPayslips: Payslip[] = data.records.map((r) => ({
        id: r.id,
        employeeId: r.employeeId,
        employeeName: r.employeeName,
        employeePosition: r.employeePosition,
        employeeArea: r.employeeArea,
        month: r.month,
        year: r.year,
        baseSalary: r.baseSalary,
        afpDiscount: r.afpDiscount,
        amount: r.netSalary,
        generatedAt: r.generatedAt,
      }));
      // Replace any existing records for this period to avoid duplicates
      set((state) => ({
        payslips: [
          ...state.payslips.filter((p) => !(p.month === month && p.year === year)),
          ...newPayslips,
        ],
      }));
    } catch {
      // Local fallback with AFP 12.71%
      const { employees } = get();
      const fallback: Payslip[] = employees
        .filter((e) => e.status === true)
        .map((e) => {
          const afpDiscount = Math.round(e.salary * 0.1271 * 100) / 100;
          return {
            id: crypto.randomUUID(),
            employeeId: e.id,
            employeeName: e.fullName,
            employeePosition: e.position,
            employeeArea: e.area,
            month,
            year,
            baseSalary: e.salary,
            afpDiscount,
            amount: Math.round((e.salary - afpDiscount) * 100) / 100,
            generatedAt: new Date().toISOString(),
          };
        });
      set((state) => ({
        payslips: [
          ...state.payslips.filter((p) => !(p.month === month && p.year === year)),
          ...fallback,
        ],
      }));
    }
  },
}));

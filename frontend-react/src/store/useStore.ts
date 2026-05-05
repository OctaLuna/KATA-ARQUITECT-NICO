import { create } from 'zustand';

export type EmployeeStatus = 'Active' | 'Inactive';

export interface Employee {
  id: string;
  name: string;
  area: string;
  position: string;
  salary: number;
  entryDate: string; // ISO String
  status: EmployeeStatus;
  vacationsBalance: number; // days
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
  month: number;
  year: number;
  amount: number;
  generatedAt: string;
}

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  
  contracts: Contract[];
  addContract: (contract: Omit<Contract, 'id' | 'generatedAt'>) => Promise<Contract>;
  
  payslips: Payslip[];
  generatePayslips: (month: number, year: number) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  
  employees: [
    {
      id: '1',
      name: 'Maria Gomez',
      area: 'Recursos Humanos',
      position: 'Directora',
      salary: 5000,
      entryDate: '2023-01-15T00:00:00Z',
      status: 'Active',
      vacationsBalance: 15,
    },
    {
      id: '2',
      name: 'Carlos Perez',
      area: 'IT',
      position: 'Desarrollador Backend',
      salary: 4000,
      entryDate: '2024-06-01T00:00:00Z',
      status: 'Active',
      vacationsBalance: 0,
    }
  ],
  addEmployee: async (employee) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        set((state) => ({
          employees: [...state.employees, { ...employee, id: Math.random().toString(36).substring(7) }]
        }));
        resolve();
      }, 500);
    });
  },
  updateEmployee: async (id, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        set((state) => ({
          employees: state.employees.map(e => (e.id === id ? { ...e, ...data } : e))
        }));
        resolve();
      }, 500);
    });
  },
  deleteEmployee: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        set((state) => ({
          employees: state.employees.map(e => (e.id === id ? { ...e, status: 'Inactive' } : e))
        }));
        resolve();
      }, 500);
    });
  },

  contracts: [],
  addContract: async (contractData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newContract = {
          ...contractData,
          id: Math.random().toString(36).substring(7),
          generatedAt: new Date().toISOString()
        };
        set((state) => ({
          contracts: [...state.contracts, newContract]
        }));
        resolve(newContract);
      }, 500);
    });
  },

  payslips: [],
  generatePayslips: async (month, year) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { employees } = get();
        const newPayslips: Payslip[] = employees
          .filter(e => e.status === 'Active')
          .map(e => ({
            id: Math.random().toString(36).substring(7),
            employeeId: e.id,
            month,
            year,
            amount: e.salary,
            generatedAt: new Date().toISOString(),
          }));
        
        set((state) => ({
          payslips: [...state.payslips, ...newPayslips]
        }));
        resolve();
      }, 500);
    });
  }
}));

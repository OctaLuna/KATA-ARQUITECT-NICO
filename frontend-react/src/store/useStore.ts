import { create } from 'zustand';
import { EmployeeService } from '../api/employeeService';

export interface Employee {
  id: string;
  fullName: string;
  ci: string;
  area: string;
  position: string;
  salary: number;
  entryDate: string; // ISO String
  status: boolean;
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
  loadEmployees: () => Promise<void>;
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
      fullName: 'Maria Gomez',
      ci: '1234567',
      area: 'Recursos Humanos',
      position: 'Directora',
      salary: 5000,
      entryDate: '2023-01-15T00:00:00Z',
      status: true,
      vacationsBalance: 15,
    },
    {
      id: '2',
      fullName: 'Carlos Perez',
      ci: '9876543',
      area: 'IT',
      position: 'Desarrollador Backend',
      salary: 4000,
      entryDate: '2024-06-01T00:00:00Z',
      status: true,
      vacationsBalance: 0,
    }
  ],
  loadEmployees: async () => {
    try {
      const data = await EmployeeService.getEmployees();
      set({ employees: data });
    } catch (e) {
      // Fallback to local data already in state
    }
  },
  addEmployee: async (employee) => {
    try {
      const newEmployee = await EmployeeService.createEmployee(employee);
      set((state) => ({
        employees: [...state.employees, newEmployee]
      }));
    } catch (e) {
      // Mock Fallback
      set((state) => ({
        employees: [...state.employees, { ...employee, id: Math.random().toString(36).substring(7) }]
      }));
      throw e;
    }
  },
  updateEmployee: async (id, data) => {
    try {
      const updated = await EmployeeService.updateEmployee(id, data);
      set((state) => ({
        employees: state.employees.map(e => (e.id === id ? { ...e, ...updated } : e))
      }));
    } catch (e) {
      // Mock Fallback
      set((state) => ({
        employees: state.employees.map(e => (e.id === id ? { ...e, ...data } : e))
      }));
      throw e;
    }
  },
  deleteEmployee: async (id) => {
    try {
      await EmployeeService.deleteEmployee(id);
      set((state) => ({
        employees: state.employees.map(e => (e.id === id ? { ...e, status: false } : e))
      }));
    } catch (e) {
      // Mock Fallback
      set((state) => ({
        employees: state.employees.map(e => (e.id === id ? { ...e, status: false } : e))
      }));
      throw e;
    }
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
  fetchPayslips: async () => {
    try {
      const response = await fetch('http://localhost:3004/api/payrolls');
      const data = await response.json();
      if (data.success) {
        const mappedPayslips = data.data.map((p: any) => {
          const [month, year] = p.period.split('-');
          return {
            id: String(p.id),
            employeeId: String(p.employeeId),
            month: Number(month),
            year: Number(year),
            amount: p.netPay,
            generatedAt: p.paymentDate
          };
        });
        set({ payslips: mappedPayslips });
      }
    } catch (error) {
      console.error('Error fetching payslips:', error);
    }
  },
  generatePayslips: async (month, year) => {
    const { employees } = get();
    const activeEmployees = employees.filter(e => e.status === 'Active');

    for (const e of activeEmployees) {
      try {
        const payload = {
          employeeId: e.id,
          employeeName: e.name,
          period: `${month}-${year}`,
          baseSalary: e.salary,
        };
        await fetch('http://localhost:3004/api/payrolls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        console.error('Error creating payroll:', error);
      }
    }

    // Refresh payslips from backend after generating
    const state = get() as any;
    if (state.fetchPayslips) {
      await state.fetchPayslips();
    }
  }
}));

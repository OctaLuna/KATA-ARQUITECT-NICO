import { employeeApi } from './axios';
import type { Employee } from '../store/useStore';

function mapEmployee(raw: any): Employee {
  return {
    id: raw.id,
    fullName: raw.fullName,
    ci: raw.ci,
    area: raw.area,
    position: raw.position,
    salary: raw.salary,
    entryDate: raw.entryDate,
    status: raw.status === 'Active' || raw.status === true,
    vacationsBalance: 0,
  };
}

export const EmployeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await employeeApi.get('/api/employees');
    return response.data.map(mapEmployee);
  },

  createEmployee: async (data: Omit<Employee, 'id'>): Promise<Employee> => {
    const response = await employeeApi.post('/api/employees', {
      fullName: data.fullName,
      ci: data.ci,
      area: data.area,
      position: data.position,
      salary: data.salary,
      entryDate: data.entryDate,
    });
    return mapEmployee(response.data);
  },

  updateEmployee: async (id: string, data: Partial<Employee>): Promise<Employee> => {
    const payload: Record<string, unknown> = {};
    if (data.area !== undefined)     payload.area     = data.area;
    if (data.position !== undefined) payload.position = data.position;
    if (data.salary !== undefined)   payload.salary   = data.salary;
    const response = await employeeApi.put(`/api/employees/${id}`, payload);
    return mapEmployee(response.data);
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await employeeApi.delete(`/api/employees/${id}`);
  },
};

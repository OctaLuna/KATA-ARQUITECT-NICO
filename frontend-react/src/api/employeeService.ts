import axios from 'axios';
import type { Employee } from '../store/useStore';

export const employeeApi = axios.create({
  baseURL: 'http://localhost:5001/api/employees',
  headers: { 'Content-Type': 'application/json' },
});

// Backend returns status as "Active"/"Inactive" string; we normalize to boolean
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
    vacationsBalance: 0, // managed by vacation-service, default 0
  };
}

export const EmployeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await employeeApi.get('');
    return response.data.map(mapEmployee);
  },

  createEmployee: async (employeeData: Omit<Employee, 'id'>): Promise<Employee> => {
    // Backend CreateEmployeeRequest: fullName, ci, area, position, salary, entryDate
    const payload = {
      fullName: employeeData.fullName,
      ci: employeeData.ci,
      area: employeeData.area,
      position: employeeData.position,
      salary: employeeData.salary,
      entryDate: employeeData.entryDate,
    };
    const response = await employeeApi.post('', payload);
    return mapEmployee(response.data);
  },

  updateEmployee: async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    // Backend UpdateEmployeeRequest only accepts: area, position, salary
    const payload: Record<string, unknown> = {};
    if (employeeData.area !== undefined) payload.area = employeeData.area;
    if (employeeData.position !== undefined) payload.position = employeeData.position;
    if (employeeData.salary !== undefined) payload.salary = employeeData.salary;
    const response = await employeeApi.put(`/${id}`, payload);
    return mapEmployee(response.data);
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await employeeApi.delete(`/${id}`);
  },
};

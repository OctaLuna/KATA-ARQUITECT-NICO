import axios from 'axios';
import type { Employee } from '../store/useStore';

// Configured specifically for the Employee microservice running on port 5001
export const employeeApi = axios.create({
  baseURL: 'http://localhost:5001/api/employees',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const EmployeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    try {
      const response = await employeeApi.get('');
      return response.data;
    } catch (error) {
      console.warn("API de de empleados no está corriendo en localhost:5001, usando datos mock");
      throw error;
    }
  },

  createEmployee: async (employeeData: Omit<Employee, 'id'>): Promise<Employee> => {
    try {
      const response = await employeeApi.post('', employeeData);
      return response.data; // Expected 201 Created + Guid
    } catch (error) {
      console.warn("Fallo al crear empleado en microservicio:", error);
      throw error;
    }
  },

  updateEmployee: async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    try {
      // Assuming a PUT endpoint exists, or adapting to what's available
      const response = await employeeApi.put(`/${id}`, employeeData);
      return response.data;
    } catch (error) {
       console.warn("Fallo al modificar empleado en microservicio:", error);
       throw error;
    }
  },

  deleteEmployee: async (id: string): Promise<void> => {
    try {
      // Expected 204 No Content -> Status goes to Inactive
      await employeeApi.delete(`/${id}`);
    } catch (error) {
      console.warn("Fallo al eliminar empleado en microservicio:", error);
      throw error;
    }
  }
};

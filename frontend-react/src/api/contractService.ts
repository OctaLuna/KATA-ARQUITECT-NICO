import { contractApi } from './axios';

export const ContractService = {
  generateContractPdf: async (data: {
    employeeName: string;
    employeePosition: string;
    employeeArea: string;
    fecha_ingreso: string;
    salario: number;
    tiempo_prueba: number;
  }): Promise<Blob> => {
    const response = await contractApi.post('/api/contracts/generate', data, {
      responseType: 'blob',
    });
    return response.data;
  },

  getAll: () =>
    contractApi.get('/api/contracts'),

  getById: (id: string) =>
    contractApi.get(`/api/contracts/${id}`, { responseType: 'blob' }),
};

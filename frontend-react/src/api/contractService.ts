import axios from 'axios';

// Configured specifically for the Contract microservice
export const contractApi = axios.create({
  baseURL: 'http://localhost:3001/api/contracts',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ContractService = {
  generateContractPdf: async (data: { 
    employeeName: string;
    employeePosition: string;
    employeeArea: string;
    fecha_ingreso: string; 
    salario: number; 
    tiempo_prueba: number;
  }): Promise<Blob> => {
    try {
      const response = await contractApi.post('/generate', data, {
        responseType: 'blob', // Important for downloading files
      });
      return response.data;
    } catch (error) {
      console.warn("API de de contratos no está corriendo en localhost:5002. Simulando error de conexión...");
      throw error;
    }
  }
};

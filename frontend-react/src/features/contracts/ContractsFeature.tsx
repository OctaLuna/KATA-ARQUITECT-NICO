import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FileDown, FileText } from 'lucide-react';
import { ContractService } from '../../api/contractService';

const schema = yup.object({
  employeeId: yup.string().required('Seleccione un empleado').default(''),
  startDate: yup.string().required('Fecha requerida').default(''),
  salary: yup.number().positive().required('Salario requerido').default(0),
  trialPeriod: yup.number().min(0).max(3).required('Periodo de prueba requerido (meses)').default(3),
});

type FormData = {
  employeeId: string;
  startDate: string;
  salary: number;
  trialPeriod: number;
};

export function ContractsFeature() {
  const { employees, addContract } = useStore();
  const [previewData, setPreviewData] = useState<FormData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const activeEmployees = employees.filter(e => e.status === true);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      trialPeriod: 3
    }
  });

  const employeeId = watch('employeeId');
  const selectedEmployee = activeEmployees.find(e => e.id === employeeId);

  const onSubmit = async (data: FormData) => {
    setPreviewData(data);
  };

  const generatePDF = async () => {
    if (!previewData || !selectedEmployee) return;

    setIsGenerating(true);
    setApiError(null);

    try {
      // 1. Guardar en el store local (opcional según tu lógica)
      await addContract({
        ...previewData,
      });

      // 2. Llamada al microservicio en localhost:3001
      // Asegúrate de que los nombres de las propiedades coincidan con lo que espera tu backend
      const blob = await ContractService.generateContractPdf({
        fecha_ingreso: previewData.startDate,
        salario: `${previewData.salary} USD`, // Formateamos el string como espera el back
        tiempo_prueba: `${previewData.trialPeriod} meses`
      });

      // 3. Descarga del archivo
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Contrato_${selectedEmployee.fullName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Limpieza
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setApiError("Error de comunicación con el microservicio en el puerto 3001. Revisa que el backend esté corriendo.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Generación de Contratos</h1>
        <p className="text-muted-foreground mt-2">Panel de exportación vía contract-service (localhost:3001).</p>
      </div>

      {apiError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-600 px-4 py-3 rounded-md text-sm font-medium mb-4 flex items-center">
          <span className="font-bold mr-2">¡Error!</span> {apiError}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración del Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Funcionario</label>
                <select 
                  className={`flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.employeeId ? 'border-red-500' : ''}`}
                  {...register('employeeId')}
                >
                  <option value="">Seleccione...</option>
                  {activeEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.position})</option>
                  ))}
                </select>
                {errors.employeeId && <p className="mt-1 text-sm text-red-500">{errors.employeeId.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Fecha de Ingreso" 
                  type="date"
                  {...register('startDate')} 
                  error={errors.startDate?.message}
                />
                <Input 
                  label="Salario Negociado" 
                  type="number"
                  {...register('salary')} 
                  error={errors.salary?.message}
                />
              </div>

              <Input 
                label="Periodo de Prueba (Meses)" 
                type="number"
                {...register('trialPeriod')} 
                error={errors.trialPeriod?.message}
              />

              <Button type="submit" className="w-full">
                Generar Previsualización
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Previsualización y Exportación</CardTitle>
          </CardHeader>
          <CardContent>
            {previewData && selectedEmployee ? (
              <div className="space-y-6">
                <div className="p-6 bg-card border border-border rounded-lg shadow-sm font-serif text-sm leading-relaxed whitespace-pre-wrap">
                  <h4 className="text-center font-bold mb-4 uppercase">Contrato Individual de Trabajo</h4>
                  <p>Entre la empresa <strong>ARCA LTDA.</strong> y el Sr(a). <strong>{selectedEmployee.fullName}</strong>, se acuerda lo siguiente:</p>
                  <ul className="list-decimal pl-5 mt-4 space-y-2">
                    <li>El trabajador cumplirá funciones como <strong>{selectedEmployee.position}</strong>.</li>
                    <li>La fecha de inicio de actividades es el <strong>{new Date(previewData.startDate).toLocaleDateString()}</strong>.</li>
                    <li>La remuneración mensual acordada es de <strong>${previewData.salary.toLocaleString()}</strong>.</li>
                    <li>Se establece un periodo de prueba de <strong>{previewData.trialPeriod} meses</strong> conforme a ley.</li>
                  </ul>
                </div>
                <Button 
                  onClick={generatePDF} 
                  className="w-full flex items-center justify-center" 
                  disabled={isGenerating}
                >
                  <FileDown className="mr-2 h-4 w-4" /> 
                  {isGenerating ? 'Generando PDF...' : 'Exportar a PDF y Guardar'}
                </Button>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
                <FileText className="h-8 w-8 mb-2 opacity-50" />
                <p>Complete el formulario para previsualizar</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
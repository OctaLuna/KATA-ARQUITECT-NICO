import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FileDown, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

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
  const { employees, contracts, addContract } = useStore();
  const [previewData, setPreviewData] = useState<FormData | null>(null);
  const activeEmployees = employees.filter(e => e.status === 'Active');

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

    try {
      await addContract({
        ...previewData,
      });

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('CONTRATO INDIVIDUAL DE TRABAJO', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`En la ciudad, a los ${new Date().getDate()} días del mes.`, 20, 40);
      doc.text(`Entre la empresa ARCA LTDA. y el Sr(a). ${selectedEmployee.name}.`, 20, 50);
      
      doc.text(`1. CARGO: El trabajador se desempeñará como ${selectedEmployee.position} en el área de ${selectedEmployee.area}.`, 20, 70, { maxWidth: 170 });
      doc.text(`2. REMUNERACIÓN: El trabajador percibirá un salario mensual de $${previewData.salary}.`, 20, 90, { maxWidth: 170 });
      doc.text(`3. FECHA DE INICIO: Las labores comenzarán el ${new Date(previewData.startDate).toLocaleDateString()}.`, 20, 110, { maxWidth: 170 });
      doc.text(`4. PERIODO DE PRUEBA: El presente contrato está sujeto a un periodo de prueba de ${previewData.trialPeriod} meses.`, 20, 130, { maxWidth: 170 });
      
      doc.save(`Contrato_${selectedEmployee.name.replace(' ', '_')}.pdf`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Generación de Contratos</h1>
        <p className="text-muted-foreground mt-2">Panel de parametrización y exportación de contratos a PDF.</p>
      </div>

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
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.position})</option>
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
                  <p>Entre la empresa <strong>ARCA LTDA.</strong> y el Sr(a). <strong>{selectedEmployee.name}</strong>, se acuerda lo siguiente:</p>
                  <ul className="list-decimal pl-5 mt-4 space-y-2">
                    <li>El trabajador cumplirá funciones como <strong>{selectedEmployee.position}</strong>.</li>
                    <li>La fecha de inicio de actividades es el <strong>{new Date(previewData.startDate).toLocaleDateString()}</strong>.</li>
                    <li>La remuneración mensual acordada es de <strong>${previewData.salary.toLocaleString()}</strong>.</li>
                    <li>Se establece un periodo de prueba de <strong>{previewData.trialPeriod} meses</strong> conforme a ley.</li>
                  </ul>
                </div>
                <Button onClick={generatePDF} className="w-full flex items-center justify-center">
                  <FileDown className="mr-2 h-4 w-4" /> Exportar a PDF y Guardar
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

import React, { useState, useEffect } from 'react';
import { useStore, Employee } from '../../store/useStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Plus, Edit2, UserMinus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  fullName: yup.string().required('El nombre es requerido').default(''),
  ci: yup.string().required('El CI es requerido').default(''),
  area: yup.string().required('El área es requerida').default(''),
  position: yup.string().required('El cargo es requerido').default(''),
  salary: yup.number().positive('Debe ser mayor a 0').required('El salario es requerido').default(0),
  entryDate: yup.string().required('La fecha de ingreso es requerida').default(''),
});

type FormData = {
  fullName: string;
  ci: string;
  area: string;
  position: string;
  salary: number;
  entryDate: string;
};

export function EmployeesFeature() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, loadEmployees } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLog, setSuccessLog] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema) as any
  });

  const openAddModal = () => {
    reset({ fullName: '', ci: '', area: '', position: '', salary: 0, entryDate: new Date().toISOString().split('T')[0] });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setValue('fullName', emp.fullName);
    setValue('ci', emp.ci);
    setValue('area', emp.area);
    setValue('position', emp.position);
    setValue('salary', emp.salary);
    setValue('entryDate', emp.entryDate.split('T')[0]);
    setEditingId(emp.id);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const payload = {
        ...data,
        entryDate: new Date(data.entryDate).toISOString(),
        status: true,
        vacationsBalance: 0
      };

      if (editingId) {
        await updateEmployee(editingId, payload);
        setSuccessLog(`[LOG] Funcionario modificado exitosamente en BD (Microservicio): ${data.fullName}`);
      } else {
        await addEmployee(payload);
        setSuccessLog(`[LOG] Nuevo funcionario persistido en BD (Microservicio): ${data.fullName}`);
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      setApiError("Error de comunicación con employee-service en localhost:5001. Fallback a estado local aplicado.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessLog(null), 5000);
      if(apiError) setTimeout(() => setApiError(null), 8000);
    }
  };

  const handleDeactivate = async (id: string, fullName: string) => {
    if(confirm(`¿Está seguro de procesar la baja lógica (Status = false) de ${fullName}?`)) {
        try {
          await deleteEmployee(id);
          setSuccessLog(`[LOG] Estado actualizado a Inactive (Status=false) vía DELETE /api/employees/${id}`);
        } catch (e) {
          setApiError("Error de comunicación con employee-service en localhost:5001. Fallback a estado local aplicado.");
        } finally {
          setTimeout(() => setSuccessLog(null), 5000);
        }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Empleados</h1>
          <p className="text-muted-foreground mt-2">Gestión de personal - Conectado a employee-service (localhost:5001)</p>
        </div>
        <Button onClick={openAddModal} className="rounded-full px-6">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Funcionario
        </Button>
      </div>

      {apiError && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-600 px-4 py-3 rounded-md text-sm font-medium mb-4 flex items-center">
          <span className="font-bold mr-2">¡Aviso!</span> {apiError}
        </div>
      )}

      {successLog && (
        <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-md text-sm font-mono mb-4">
          {successLog}
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4">Nombre Completo</th>
                <th className="px-6 py-4">CI</th>
                <th className="px-6 py-4">Área</th>
                <th className="px-6 py-4">Cargo</th>
                <th className="px-6 py-4">Salario</th>
                <th className="px-6 py-4">Ingreso</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium">{emp.fullName}</td>
                  <td className="px-6 py-4 text-muted-foreground">{emp.ci}</td>
                  <td className="px-6 py-4">{emp.area}</td>
                  <td className="px-6 py-4">{emp.position}</td>
                  <td className="px-6 py-4">${emp.salary.toLocaleString()}</td>
                  <td className="px-6 py-4">{new Date(emp.entryDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant={emp.status ? 'success' : 'destructive'} className="uppercase">
                      {emp.status ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(emp)} disabled={!emp.status}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDeactivate(emp.id, emp.fullName)} disabled={!emp.status}>
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {employees.length === 0 && (
             <div className="p-8 text-center text-muted-foreground">No hay funcionarios registrados</div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={editingId ? 'Modificar Funcionario' : 'Alta de Funcionario'}
      >
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
          <Input 
            label="Nombre Completo" 
            {...register('fullName')} 
            error={errors.fullName?.message} 
          />
          <Input 
            label="Cédula de Identidad (CI)" 
            {...register('ci')} 
            error={errors.ci?.message} 
          />
          <Input 
            label="Área" 
            {...register('area')} 
            error={errors.area?.message} 
          />
          <Input 
            label="Cargo" 
            {...register('position')} 
            error={errors.position?.message} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Salario Base" 
              type="number" 
              {...register('salary')} 
              error={errors.salary?.message} 
            />
            <Input 
              label="Fecha Ingreso" 
              type="date" 
              {...register('entryDate')} 
              error={errors.entryDate?.message} 
            />
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingId ? 'Guardar Cambios' : 'Registrar Alta'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

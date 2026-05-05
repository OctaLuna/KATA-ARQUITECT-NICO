import React, { useState } from 'react';
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
  name: yup.string().required('El nombre es requerido').default(''),
  area: yup.string().required('El área es requerida').default(''),
  position: yup.string().required('El cargo es requerido').default(''),
  salary: yup.number().positive('Debe ser mayor a 0').required('El salario es requerido').default(0),
  entryDate: yup.string().required('La fecha de ingreso es requerida').default(''),
});

type FormData = {
  name: string;
  area: string;
  position: string;
  salary: number;
  entryDate: string;
};

export function EmployeesFeature() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLog, setSuccessLog] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema) as any
  });

  const openAddModal = () => {
    reset({ name: '', area: '', position: '', salary: 0, entryDate: new Date().toISOString().split('T')[0] });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setValue('name', emp.name);
    setValue('area', emp.area);
    setValue('position', emp.position);
    setValue('salary', emp.salary);
    setValue('entryDate', emp.entryDate.split('T')[0]);
    setEditingId(emp.id);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        entryDate: new Date(data.entryDate).toISOString(),
        status: 'Active' as const,
        vacationsBalance: 0
      };

      if (editingId) {
        await updateEmployee(editingId, payload);
        setSuccessLog(`[LOG] Funcionario modificado exitosamente en BD: ${data.name}`);
      } else {
        await addEmployee(payload);
        setSuccessLog(`[LOG] Nuevo funcionario persistido en BD: ${data.name}`);
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessLog(null), 5000);
    }
  };

  const handleDeactivate = async (id: string, name: string) => {
    if(confirm(`¿Está seguro de procesar la baja de ${name}?`)) {
      await deleteEmployee(id);
      setSuccessLog(`[LOG] Funcionario dado de baja exitosamente: ${name}`);
      setTimeout(() => setSuccessLog(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Gestión de Personal</h1>
          <p className="text-muted-foreground mt-2">Alta, baja y modificación de funcionarios.</p>
        </div>
        <Button onClick={openAddModal} className="rounded-full px-6">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Funcionario
        </Button>
      </div>

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
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Área / Cargo</th>
                <th className="px-6 py-4">Salario</th>
                <th className="px-6 py-4">Ingreso</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium">{emp.name}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{emp.area}</div>
                    <div className="text-muted-foreground">{emp.position}</div>
                  </td>
                  <td className="px-6 py-4">${emp.salary.toLocaleString()}</td>
                  <td className="px-6 py-4">{new Date(emp.entryDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant={emp.status === 'Active' ? 'success' : 'destructive'}>
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(emp)} disabled={emp.status !== 'Active'}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDeactivate(emp.id, emp.name)} disabled={emp.status !== 'Active'}>
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
            {...register('name')} 
            error={errors.name?.message} 
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

import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  area: string;
  role: string;
  salary: number;
  status: 'Activo' | 'Baja';
}

const initialData: Employee[] = [
  { id: '1', name: 'Ana Silva', area: 'Tecnología', role: 'Desarrolladora Senior', salary: 15000, status: 'Activo' },
  { id: '2', name: 'Carlos Mendoza', area: 'Finanzas', role: 'Analista', salary: 8000, status: 'Activo' },
];

export default function Personal() {
  const [employees, setEmployees] = useState<Employee[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');

  const openModal = (emp?: Employee) => {
    if (emp) {
      setEditingId(emp.id);
      setName(emp.name);
      setArea(emp.area);
      setRole(emp.role);
      setSalary(emp.salary.toString());
    } else {
      setEditingId(null);
      setName('');
      setArea('');
      setRole('');
      setSalary('');
    }
    setShowModal(true);
  };

  const saveEmployee = () => {
    if (editingId) {
      setEmployees(employees.map(e => e.id === editingId ? { ...e, name, area, role, salary: Number(salary) } : e));
    } else {
      const newEmp: Employee = {
        id: Math.random().toString(),
        name, area, role, salary: Number(salary), status: 'Activo'
      };
      setEmployees([...employees, newEmp]);
    }
    setShowModal(false);
  };

  const removeEmployee = (id: string) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, status: 'Baja' } : e));
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Personal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Gestión de alta, modificación y baja</p>
        </div>
        <button className="glass-button" onClick={() => openModal()}>
          <Plus size={18} /> Nuevo Funcionario
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="glass-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Área</th>
              <th>Cargo</th>
              <th>Remuneración</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td style={{ fontWeight: 500 }}>{emp.name}</td>
                <td>{emp.area}</td>
                <td>{emp.role}</td>
                <td>${emp.salary.toLocaleString()}</td>
                <td>
                  <span className={`badge ${emp.status === 'Activo' ? 'success' : 'warning'}`}>
                    {emp.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="glass-button" style={{ padding: '0.4rem' }} onClick={() => openModal(emp)}>
                      <Edit2 size={16} />
                    </button>
                    {emp.status === 'Activo' && (
                      <button className="glass-button danger" style={{ padding: '0.4rem' }} onClick={() => removeEmployee(emp.id)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: 400, padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Modificar' : 'Alta de'} Funcionario</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <input className="glass-input" placeholder="Nombre completo" value={name} onChange={e => setName(e.target.value)} disabled={!!editingId} />
              <input className="glass-input" placeholder="Área" value={area} onChange={e => setArea(e.target.value)} />
              <input className="glass-input" placeholder="Cargo" value={role} onChange={e => setRole(e.target.value)} />
              <input className="glass-input" type="number" placeholder="Remuneración" value={salary} onChange={e => setSalary(e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="glass-button" style={{ background: 'transparent' }} onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="glass-button" onClick={saveEmployee}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

interface VacationStatus {
  id: string;
  name: string;
  antiquityYears: number;
  daysAvailable: number;
  daysUsed: number;
}

const mockData: VacationStatus[] = [
  { id: '1', name: 'Ana Silva', antiquityYears: 2, daysAvailable: 15, daysUsed: 0 },
  { id: '2', name: 'Carlos Mendoza', antiquityYears: 0.5, daysAvailable: 0, daysUsed: 0 },
  { id: '3', name: 'Lucía Torres', antiquityYears: 3, daysAvailable: 10, daysUsed: 5 },
];

export default function Vacaciones() {
  const [data] = useState<VacationStatus[]>(mockData);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Vacaciones</h1>
          <p style={{ color: 'var(--text-muted)' }}>Funcionarios con &gt; 1 año gozan de 15 días por gestión</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {data.map(emp => {
          const isEligible = emp.antiquityYears >= 1;
          return (
            <div key={emp.id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              {!isEligible && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                  <span className="badge warning">No elegible (Menos de 1 año)</span>
                </div>
              )}
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {emp.name}
                {isEligible && <CheckCircle2 size={18} color="var(--success)" />}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Antigüedad: {emp.antiquityYears} años</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem' }}>Días Disponibles</span>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{emp.daysAvailable}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem' }}>Días Usados</span>
                <span style={{ fontWeight: 'bold' }}>{emp.daysUsed}</span>
              </div>

              <button className="glass-button" style={{ width: '100%', justifyContent: 'center' }} disabled={!isEligible || emp.daysAvailable === 0}>
                <CalendarIcon size={18} /> Programar Vacación
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

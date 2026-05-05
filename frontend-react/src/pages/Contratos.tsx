import { useState } from 'react';
import { FileSignature, Download } from 'lucide-react';

export default function Contratos() {
  const [employeeName, setEmployeeName] = useState('Juan Pérez');
  const [entryDate, setEntryDate] = useState('2026-05-06');
  const [salary, setSalary] = useState('10000');
  const [probationMonths, setProbationMonths] = useState('3');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      <div style={{ flex: 1 }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Generación de Contratos</h1>
            <p style={{ color: 'var(--text-muted)' }}>Parametrización de nuevo contrato</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nombre del Funcionario</label>
            <input className="glass-input" value={employeeName} onChange={e => setEmployeeName(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fecha de Ingreso</label>
            <input className="glass-input" type="date" value={entryDate} onChange={e => setEntryDate(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Salario (Bs.)</label>
            <input className="glass-input" type="number" value={salary} onChange={e => setSalary(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tiempo de Prueba (Meses)</label>
            <input className="glass-input" type="number" value={probationMonths} onChange={e => setProbationMonths(e.target.value)} />
          </div>
          <button className="glass-button" style={{ marginTop: '1rem', justifyContent: 'center' }}>
            <FileSignature size={18} /> Actualizar Previsualización
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button className="glass-button"><Download size={18} /> Exportar PDF</button>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '3rem', background: '#f8fafc', color: '#0f172a', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ borderBottom: '2px solid #cbd5e1', paddingBottom: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ARCA LTDA.</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Contrato Individual de Trabajo</p>
          </div>
          
          <div style={{ fontSize: '0.95rem', lineHeight: 1.8, textAlign: 'justify' }}>
            <p>Conste por el presente documento el contrato de trabajo que celebran por una parte <strong>ARCA LTDA.</strong>, y por otra parte el señor(a) <strong>{employeeName || '_________________'}</strong>.</p>
            <p style={{ marginTop: '1rem' }}><strong>PRIMERA (Fecha de Ingreso):</strong> El funcionario iniciará sus labores en la empresa a partir del <strong>{entryDate || '___/___/____'}</strong>.</p>
            <p style={{ marginTop: '1rem' }}><strong>SEGUNDA (Remuneración):</strong> La empresa abonará al funcionario un salario mensual de <strong>Bs. {salary || '________'}</strong>, pagaderos a mes vencido.</p>
            <p style={{ marginTop: '1rem' }}><strong>TERCERA (Periodo de Prueba):</strong> El presente contrato está sujeto a un periodo de prueba legal de <strong>{probationMonths || '_'} meses</strong>, durante el cual cualquiera de las partes podrá dar por terminado el contrato sin previo aviso.</p>
          </div>

          <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ borderTop: '1px solid #0f172a', width: '150px', margin: '0 auto', paddingTop: '0.5rem' }}>ARCA LTDA.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ borderTop: '1px solid #0f172a', width: '150px', margin: '0 auto', paddingTop: '0.5rem' }}>{employeeName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

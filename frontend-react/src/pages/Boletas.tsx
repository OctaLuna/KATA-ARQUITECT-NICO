import { useState } from 'react';
import { FileText, Printer } from 'lucide-react';

interface Payment {
  id: string;
  employee: string;
  date: string;
  amount: number;
  status: 'Pagado' | 'Pendiente';
}

const paymentsData: Payment[] = [
  { id: '1', employee: 'Ana Silva', date: '2026-04-30', amount: 15000, status: 'Pagado' },
  { id: '2', employee: 'Carlos Mendoza', date: '2026-04-30', amount: 8000, status: 'Pagado' },
];

export default function Boletas() {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      <div style={{ flex: 1 }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Boletas de Pago</h1>
            <p style={{ color: 'var(--text-muted)' }}>Historial de pagos y generación de boletas</p>
          </div>
        </div>

        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Funcionario</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {paymentsData.map(pay => (
                <tr key={pay.id}>
                  <td style={{ fontWeight: 500 }}>{pay.employee}</td>
                  <td>{pay.date}</td>
                  <td>${pay.amount.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${pay.status === 'Pagado' ? 'success' : 'warning'}`}>
                      {pay.status}
                    </span>
                  </td>
                  <td>
                    <button className="glass-button" style={{ padding: '0.4rem' }} onClick={() => setSelectedPayment(pay)}>
                      <FileText size={16} /> Ver Boleta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPayment && (
        <div style={{ width: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Vista Previa</h2>
            <button className="glass-button"><Printer size={16} /> Imprimir</button>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--primary-color)' }}>ARCA LTDA</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RECIBO DE PAGO DE HABERES</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Funcionario:</span>
                <strong style={{ fontSize: '1rem' }}>{selectedPayment.employee}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Fecha de Pago:</span>
                <strong>{selectedPayment.date}</strong>
              </div>
              
              <div style={{ margin: '1rem 0', borderTop: '1px dashed var(--glass-border)' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Salario Básico</span>
                <span>Bs. {selectedPayment.amount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                <span>Descuentos (AFP)</span>
                <span>Bs. -{(selectedPayment.amount * 0.1271).toLocaleString()}</span>
              </div>
              
              <div style={{ margin: '1rem 0', borderTop: '1px dashed var(--glass-border)' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                <span>Total Líquido:</span>
                <span>Bs. {(selectedPayment.amount * 0.8729).toLocaleString()}</span>
              </div>
            </div>
            
            <div style={{ marginTop: '3rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Firma del Funcionario</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

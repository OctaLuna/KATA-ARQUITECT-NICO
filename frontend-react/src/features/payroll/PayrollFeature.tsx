import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Play, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { PayrollService, Payroll } from '../../api/payrollService';

export function PayrollFeature() {
  const { employees, loadEmployees } = useStore();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
    fetchPayrolls();
  }, [loadEmployees]);

  const fetchPayrolls = async () => {
    try {
      const data = await PayrollService.getPayrolls();
      setPayrolls(data);
    } catch (e) {
      setApiError("Error consultando planillas en localhost:3004.");
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setApiError(null);
    try {
      const activeEmployees = employees.filter(e => e.status === true);
      const period = `${month.toString().padStart(2, '0')}-${year}`;
      let created = 0;

      for (const emp of activeEmployees) {
        await PayrollService.generatePayroll({
          employeeId: emp.id,
          employeeName: emp.fullName,
          period,
          baseSalary: emp.salary,
        });
        created++;
      }
      
      setSuccessMsg(`[LOG] Se generaron ${created} planillas exitosamente.`);
      await fetchPayrolls();
    } catch (e) {
      setApiError("Fallaron interacciones con localhost:3004 al procesar planillas.");
    } finally {
      setIsGenerating(false);
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  const downloadBoleta = (payroll: Payroll) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('BOLETA DE PAGO - ARCA LTDA.', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Funcionario: ${payroll.employeeName}`, 20, 40);
    // Position might not be stored in payroll, we can look it up from employees
    const emp = employees.find(e => e.id === payroll.employeeId);
    doc.text(`Cargo: ${emp?.position || 'ND'}`, 20, 50);
    doc.text(`Periodo: ${payroll.period}`, 20, 60);
    
    doc.line(20, 70, 190, 70);
    
    doc.text(`SALARIO BÁSICO:`, 20, 85);
    doc.text(`$${payroll.baseSalary.toLocaleString()}`, 170, 85, { align: 'right' });
    
    doc.save(`Boleta_${payroll.employeeName.replace(' ', '_')}_${payroll.period}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Planillas y Boletas de Pago</h1>
        <p className="text-muted-foreground mt-2">Histórico y descarga de boletas de pago mes a mes. Integración con payroll-service en localhost:3004.</p>
      </div>

      {apiError && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-600 px-4 py-3 rounded-md text-sm font-medium mb-4 flex items-center">
          <span className="font-bold mr-2">¡Aviso!</span> {apiError}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-md text-sm font-mono flex items-center mb-4">
          {successMsg}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Generación de Planilla Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <Input 
              label="Mes (1-12)" 
              type="number" 
              min={1} max={12} 
              value={month} 
              onChange={e => setMonth(Number(e.target.value))} 
              className="sm:w-32"
            />
            <Input 
              label="Año" 
              type="number" 
              value={year} 
              onChange={e => setYear(Number(e.target.value))} 
              className="sm:w-32"
            />
            <Button onClick={handleGenerate} isLoading={isGenerating}>
              <Play className="mr-2 h-4 w-4" /> Procesar Planilla
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4">ID Transacción</th>
                <th className="px-6 py-4">Funcionario</th>
                <th className="px-6 py-4">Periodo</th>
                <th className="px-6 py-4 text-right">Salario Base</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.slice().reverse().map(payroll => (
                <tr key={payroll.id || Math.random().toString()} className="border-b border-border hover:bg-muted/30">
                  <td className="px-6 py-4 font-mono text-xs">{payroll.id || 'N/A'}</td>
                  <td className="px-6 py-4 font-medium">{payroll.employeeName}</td>
                  <td className="px-6 py-4">{payroll.period}</td>
                  <td className="px-6 py-4 text-right">${payroll.baseSalary.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => downloadBoleta(payroll)}>
                      <Download className="mr-2 h-4 w-4" /> Boleta
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payrolls.length === 0 && (
             <div className="p-8 text-center text-muted-foreground">No hay planillas generadas en el histórico o hubo un error al conectar con el microservicio.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

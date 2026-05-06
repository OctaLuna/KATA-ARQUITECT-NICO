import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Play, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export function PayrollFeature() {
  const { payslips, generatePayslips, employees } = useStore();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await generatePayslips(month, year);
    setIsGenerating(false);
  };

  const activeEmployees = employees.filter(e => e.status === true);

  const downloadBoleta = (payslipId: string) => {
    const payslip = payslips.find(p => p.id === payslipId);
    if (!payslip) return;
    const employee = employees.find(e => e.id === payslip.employeeId);
    if (!employee) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('BOLETA DE PAGO - ARCA LTDA.', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Funcionario: ${employee.fullName}`, 20, 40);
    doc.text(`Cargo: ${employee.position}`, 20, 50);
    doc.text(`Periodo: ${payslip.month}/${payslip.year}`, 20, 60);
    
    doc.line(20, 70, 190, 70);
    
    doc.text(`SALARIO BÁSICO:`, 20, 85);
    doc.text(`$${payslip.amount.toLocaleString()}`, 170, 85, { align: 'right' });
    
    doc.save(`Boleta_${employee.fullName.replace(' ', '_')}_${payslip.month}_${payslip.year}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Planillas y Boletas de Pago</h1>
        <p className="text-muted-foreground mt-2">Histórico y descarga de boletas de pago mes a mes.</p>
      </div>

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
                <th className="px-6 py-4 text-right">Monto</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {payslips.slice().reverse().map(payslip => {
                const emp = employees.find(e => e.id === payslip.employeeId);
                return (
                  <tr key={payslip.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-6 py-4 font-mono text-xs">{payslip.id}</td>
                    <td className="px-6 py-4 font-medium">{emp?.fullName || 'Desconocido'}</td>
                    <td className="px-6 py-4">{payslip.month} / {payslip.year}</td>
                    <td className="px-6 py-4 text-right">${payslip.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => downloadBoleta(payslip.id)}>
                        <Download className="mr-2 h-4 w-4" /> Boleta
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {payslips.length === 0 && (
             <div className="p-8 text-center text-muted-foreground">No hay planillas generadas en el histórico.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

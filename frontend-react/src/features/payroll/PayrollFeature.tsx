import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Play, Download, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';

export function PayrollFeature() {
  const { payslips, generatePayslips, loadPayslips } = useStore();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    loadPayslips().finally(() => setIsLoading(false));
  }, [loadPayslips]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setApiError(null);
    try {
      await generatePayslips(month, year);
      setSuccessMsg(`Planilla ${String(month).padStart(2, '0')}/${year} procesada.`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch {
      setApiError('payroll-service no disponible en localhost:5004. Se aplicó AFP localmente como fallback.');
      setTimeout(() => setApiError(null), 8000);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadBoleta = (payslipId: string) => {
    const p = payslips.find((x) => x.id === payslipId);
    if (!p) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ARCA LTDA.', 105, 18, { align: 'center' });

    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('BOLETA DE PAGO', 105, 26, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30);

    doc.setFontSize(11);
    doc.text(`Funcionario : ${p.employeeName}`, 20, 42);
    doc.text(`Cargo       : ${p.employeePosition}`, 20, 50);
    doc.text(`Área        : ${p.employeeArea}`, 20, 58);
    doc.text(`Periodo     : ${String(p.month).padStart(2, '0')} / ${p.year}`, 20, 66);

    doc.line(20, 72, 190, 72);

    doc.setFont('helvetica', 'bold');
    doc.text('HABERES', 20, 82);
    doc.text('DESCUENTOS', 110, 82);

    doc.setFont('helvetica', 'normal');
    doc.text('Salario Básico', 20, 93);
    doc.text(`Bs. ${p.baseSalary.toFixed(2)}`, 90, 93, { align: 'right' });

    doc.text('AFP (12.71%) — D.S. 23570', 110, 93);
    doc.text(`Bs. ${p.afpDiscount.toFixed(2)}`, 190, 93, { align: 'right' });

    doc.line(20, 103, 190, 103);

    doc.setFont('helvetica', 'bold');
    doc.text('LÍQUIDO PAGABLE:', 20, 115);
    doc.text(`Bs. ${p.amount.toFixed(2)}`, 190, 115, { align: 'right' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(`Generado: ${new Date(p.generatedAt).toLocaleDateString()}`, 105, 128, { align: 'center' });
    doc.text('ARCA HR System — Gestión de Recursos Humanos', 105, 280, { align: 'center' });

    doc.save(`Boleta_${p.employeeName.replace(/ /g, '_')}_${String(p.month).padStart(2, '0')}_${p.year}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Planillas y Boletas de Pago</h1>
          <p className="text-muted-foreground mt-2">
            Histórico y descarga de boletas — payroll-service (localhost:5004) · AFP 12.71% aplicado
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setIsLoading(true); loadPayslips().finally(() => setIsLoading(false)); }} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {apiError && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-600 px-4 py-3 rounded-md text-sm font-medium flex items-center">
          <span className="font-bold mr-2">¡Aviso!</span> {apiError}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-md text-sm font-mono">
          [LOG] {successMsg}
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
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="sm:w-32"
            />
            <Input
              label="Año"
              type="number"
              min={2020}
              max={2100}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
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
                <th className="px-6 py-4">Funcionario</th>
                <th className="px-6 py-4">Período</th>
                <th className="px-6 py-4 text-right">Salario Base</th>
                <th className="px-6 py-4 text-right">AFP (12.71%)</th>
                <th className="px-6 py-4 text-right">Neto</th>
                <th className="px-6 py-4 text-right">Boleta</th>
              </tr>
            </thead>
            <tbody>
              {payslips
                .slice()
                .sort((a, b) => b.year - a.year || b.month - a.month)
                .map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <p className="font-medium">{p.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{p.employeePosition}</p>
                    </td>
                    <td className="px-6 py-4">
                      {String(p.month).padStart(2, '0')} / {p.year}
                    </td>
                    <td className="px-6 py-4 text-right font-mono">Bs. {p.baseSalary.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-right font-mono text-red-500">- Bs. {p.afpDiscount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold">Bs. {p.amount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => downloadBoleta(p.id)}>
                        <Download className="mr-2 h-4 w-4" /> Boleta
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {payslips.length === 0 && !isLoading && (
            <div className="p-8 text-center text-muted-foreground">
              No hay planillas generadas. Seleccione período y presione "Procesar Planilla".
            </div>
          )}
          {isLoading && (
            <div className="p-8 text-center text-muted-foreground">Cargando historial...</div>
          )}
        </div>
      </Card>
    </div>
  );
}

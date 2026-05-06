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
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await loadPayslips();
      setIsLoading(false);
    };
    init();
  }, [loadPayslips]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await generatePayslips(month, year);
    setSuccessMsg(`[LOG] Planilla ${String(month).padStart(2, '0')}/${year} procesada — ${payslips.filter(p => p.month === month && p.year === year).length} registros.`);
    setIsGenerating(false);
    setTimeout(() => setSuccessMsg(null), 6000);
  };

  const downloadBoleta = (payslipId: string) => {
    const payslip = payslips.find((p) => p.id === payslipId);
    if (!payslip) return;

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
    doc.text(`Funcionario : ${payslip.employeeName}`, 20, 42);
    doc.text(`Cargo       : ${payslip.employeePosition}`, 20, 50);
    doc.text(`Área        : ${payslip.employeeArea}`, 20, 58);
    doc.text(`Periodo     : ${String(payslip.month).padStart(2, '0')} / ${payslip.year}`, 20, 66);

    doc.line(20, 72, 190, 72);

    doc.setFont('helvetica', 'bold');
    doc.text('HABERES', 20, 82);
    doc.text('DESCUENTOS', 110, 82);

    doc.setFont('helvetica', 'normal');
    doc.text('Salario Básico', 20, 92);
    doc.text(`Bs. ${payslip.baseSalary.toFixed(2)}`, 90, 92, { align: 'right' });

    doc.text('AFP (12.71%) — D.S. 23570', 110, 92);
    doc.text(`Bs. ${payslip.afpDiscount.toFixed(2)}`, 190, 92, { align: 'right' });

    doc.line(20, 102, 190, 102);

    doc.setFont('helvetica', 'bold');
    doc.text('LÍQUIDO PAGABLE:', 20, 114);
    doc.text(`Bs. ${payslip.amount.toFixed(2)}`, 190, 114, { align: 'right' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Documento generado por ARCA HR System', 105, 280, { align: 'center' });

    doc.save(`Boleta_${payslip.employeeName.replace(/ /g, '_')}_${payslip.month}_${payslip.year}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Planillas y Boletas de Pago</h1>
          <p className="text-muted-foreground mt-2">Histórico y descarga de boletas de pago mes a mes — payroll-service (localhost:5004).</p>
        </div>
        <Button variant="outline" size="sm" onClick={async () => { setIsLoading(true); await loadPayslips(); setIsLoading(false); }} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Recargar
        </Button>
      </div>

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-md text-sm font-mono">
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
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="sm:w-32"
            />
            <Input
              label="Año"
              type="number"
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
                <th className="px-6 py-4">ID Transacción</th>
                <th className="px-6 py-4">Funcionario</th>
                <th className="px-6 py-4">Cargo / Área</th>
                <th className="px-6 py-4">Periodo</th>
                <th className="px-6 py-4 text-right">Salario Base</th>
                <th className="px-6 py-4 text-right">AFP (12.71%)</th>
                <th className="px-6 py-4 text-right">Líquido</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                    <RefreshCw className="inline mr-2 h-4 w-4 animate-spin" />
                    Cargando histórico...
                  </td>
                </tr>
              ) : (
                payslips
                  .slice()
                  .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
                  .map((payslip) => (
                    <tr key={payslip.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-4 font-mono text-xs">{payslip.id.substring(0, 8)}…</td>
                      <td className="px-6 py-4 font-medium">{payslip.employeeName}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {payslip.employeePosition}<br />{payslip.employeeArea}
                      </td>
                      <td className="px-6 py-4">
                        {String(payslip.month).padStart(2, '0')} / {payslip.year}
                      </td>
                      <td className="px-6 py-4 text-right">Bs. {payslip.baseSalary.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-red-500">- Bs. {payslip.afpDiscount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-bold">Bs. {payslip.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm" onClick={() => downloadBoleta(payslip.id)}>
                          <Download className="mr-2 h-4 w-4" /> Boleta
                        </Button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
          {!isLoading && payslips.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No hay planillas en el histórico. Procese una planilla mensual para comenzar.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { differenceInYears, differenceInMonths, isValid } from 'date-fns';
import { CheckCircle2, UserCheck, CalendarDays } from 'lucide-react';
import { VacationService, VacationBalance } from '../../api/vacationService';
import { Input } from '../../components/ui/Input';

export function VacationsFeature() {
  const { employees, loadEmployees } = useStore();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<string, VacationBalance>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [useDaysForm, setUseDaysForm] = useState<Record<string, number>>({});

  useEffect(() => {
    loadEmployees();
    fetchBalances();
  }, [loadEmployees]);

  const activeEmployees = employees.filter(e => e.status === true);

  const fetchBalances = async () => {
    try {
      const data = await VacationService.getAllBalances();
      const balanceMap = data.reduce((acc, b) => {
        acc[b.employeeId] = b;
        return acc;
      }, {} as Record<string, VacationBalance>);
      setBalances(balanceMap);
    } catch (e) {
      setApiError("Error consultando saldos. Asegurese de que employee-service y vacation-service estén corriendo.");
    }
  };

  const getSeniority = (dateStr: string) => {
    const entryDate = new Date(dateStr);
    if (!isValid(entryDate)) return { years: 0, months: 0 };
    const now = new Date();
    const years = differenceInYears(now, entryDate);
    const totalMonths = differenceInMonths(now, entryDate);
    const remainingMonths = totalMonths % 12;
    return { years, months: remainingMonths };
  };

  const handleCalculateBalances = async () => {
    setIsCalculating(true);
    setApiError(null);
    try {
      const res = await VacationService.calculateBalances();
      setSuccessMsg(`[LOG] Saldos calculados exitosamente. Creados: ${res.newRecordsCreated}`);
      await fetchBalances();
    } catch (e) {
      setApiError("Error calculando saldos.");
    } finally {
      setIsCalculating(false);
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  const handleUseDays = async (employeeId: string, name: string) => {
    const days = useDaysForm[employeeId] || 0;
    if (days <= 0) return;
    setApiError(null);
    try {
      await VacationService.useVacationDays(employeeId, days);
      setSuccessMsg(`[LOG] Se usaron ${days} días para ${name}.`);
      setUseDaysForm(prev => ({ ...prev, [employeeId]: 0 }));
      await fetchBalances();
    } catch (e) {
      setApiError(`Error al usar días para ${name}. Verifique restricciones.`);
    } finally {
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Módulo de Vacaciones</h1>
          <p className="text-muted-foreground mt-2">Integrado con vacation-service (localhost:5002).</p>
        </div>
        <Button onClick={handleCalculateBalances} className="rounded-full px-6" isLoading={isCalculating}>
           <CalendarDays className="mr-2 h-4 w-4" /> Calcular Saldos
        </Button>
      </div>

      {apiError && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-600 px-4 py-3 rounded-md text-sm font-medium mb-4 flex items-center">
          <span className="font-bold mr-2">¡Aviso!</span> {apiError}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-md text-sm font-mono flex items-center mb-4">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {successMsg}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeEmployees.map(emp => {
          const { years, months } = getSeniority(emp.entryDate);
          const balance = balances[emp.id];
          const hasBalanceRecord = !!balance;

          return (
            <Card key={emp.id} className="ring-1 ring-border/50 border-none transition-all hover:scale-[1.02] bg-card">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-xl tracking-tight mb-1">{emp.fullName}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{emp.area}</p>
                  </div>
                  {hasBalanceRecord ? (
                    <Badge variant="success" className="px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Con Saldo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="px-3 py-1 rounded-full text-xs font-bold bg-muted/50">
                      Sin registro
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 mb-8 bg-background/50 rounded-2xl p-4 border border-border/50">
                  <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Antigüedad:</span>
                     <span className="font-bold">{years} años, {months} meses</span>
                  </div>
                  {hasBalanceRecord && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Días Totales:</span>
                        <span className="font-bold">{balance.totalDays}</span>
                      </div>
                      <div className="flex justify-between text-sm text-red-500">
                        <span className="">Días Usados:</span>
                        <span className="font-bold">{balance.usedDays}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-500 pt-2 border-t border-border">
                        <span className="font-bold">Días Disponibles:</span>
                        <span className="font-bold text-lg">{balance.availableDays}</span>
                      </div>
                    </>
                  )}
                </div>

                {hasBalanceRecord && balance.availableDays > 0 ? (
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        type="number"
                        min="1"
                        max={balance.availableDays}
                        placeholder="Días"
                        value={useDaysForm[emp.id] || ''}
                        onChange={(e) => setUseDaysForm(prev => ({ ...prev, [emp.id]: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <Button 
                      className="bg-primary text-primary-foreground font-bold" 
                      onClick={() => handleUseDays(emp.id, emp.fullName)}
                      disabled={!useDaysForm[emp.id]}
                    >
                      Usar
                    </Button>
                  </div>
                ) : (
                  <Button 
                   variant="outline"
                   className="w-full text-sm font-bold border-border/50 text-muted-foreground" 
                   disabled
                  >
                   {hasBalanceRecord ? 'Sin días disponibles' : 'Pendiente de cálculo'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
        {activeEmployees.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground">
            No hay empleados activos o no se pudo comunicar con el ms.
          </div>
        )}
      </div>
    </div>
  );
}

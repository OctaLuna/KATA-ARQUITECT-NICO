import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { VacationService, type VacationBalance } from '../../api/vacationService';
import { differenceInYears, differenceInMonths, isValid } from 'date-fns';
import { CheckCircle2, RefreshCw, Calculator } from 'lucide-react';

export function VacationsFeature() {
  const { employees, updateEmployeeLocal } = useStore();
  const [balances, setBalances] = useState<VacationBalance[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);

  const activeEmployees = employees.filter((e) => e.status === true);

  const getSeniority = (dateStr: string) => {
    const entryDate = new Date(dateStr);
    if (!isValid(entryDate)) return { years: 0, months: 0 };
    const now = new Date();
    const years = differenceInYears(now, entryDate);
    const totalMonths = differenceInMonths(now, entryDate);
    return { years, months: totalMonths % 12 };
  };

  const loadBalances = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await VacationService.getAll();
      setBalances(data);
      setIsBackendAvailable(true);
      // Sync vacationsBalance into the employee store for display consistency
      data.forEach((b) => updateEmployeeLocal(b.employeeId, { vacationsBalance: b.availableDays }));
    } catch {
      setIsBackendAvailable(false);
    } finally {
      setIsLoading(false);
    }
  }, [updateEmployeeLocal]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  const getBalance = (employeeId: string): VacationBalance | null =>
    balances.find((b) => b.employeeId === employeeId) ?? null;

  const handleCalculate = async () => {
    setIsCalculating(true);
    setApiError(null);
    try {
      const result = await VacationService.calculate();
      const msg = `[LOG] Cálculo completado — ${result.eligible} elegibles de ${result.totalProcessed} empleados procesados (año ${result.managementYear}).`;
      setSuccessMsg(msg);
      await loadBalances();
    } catch {
      setApiError('vacation-service no disponible en localhost:5002. Los saldos se muestran desde estado local.');
    } finally {
      setIsCalculating(false);
      setTimeout(() => setSuccessMsg(null), 6000);
    }
  };

  const handleUseDays = async (employeeId: string, name: string, days: number) => {
    setLoadingIds((prev) => new Set(prev).add(employeeId));
    setApiError(null);
    try {
      const updated = await VacationService.useDays(employeeId, days);
      setBalances((prev) =>
        prev.map((b) => (b.employeeId === employeeId ? updated : b))
      );
      updateEmployeeLocal(employeeId, { vacationsBalance: updated.availableDays });
      setSuccessMsg(`[LOG] ${days} días de vacación registrados para ${name}. Saldo disponible: ${updated.availableDays} días.`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch {
      // Fallback: local state update only
      updateEmployeeLocal(employeeId, {
        vacationsBalance: (employees.find((e) => e.id === employeeId)?.vacationsBalance ?? 0) + days,
      });
      setSuccessMsg(`[LOG] ${days} días habilitados localmente para ${name} (vacation-service sin conexión).`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(employeeId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Módulo de Vacaciones</h1>
          <p className="text-muted-foreground mt-2">
            Saldos y antigüedad — vacation-service{' '}
            <span className={isBackendAvailable ? 'text-green-500' : 'text-yellow-500'}>
              {isBackendAvailable ? '(conectado · localhost:5002)' : '(sin conexión · modo local)'}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadBalances} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={handleCalculate} isLoading={isCalculating} disabled={isCalculating}>
            <Calculator className="mr-2 h-4 w-4" />
            Calcular Vacaciones
          </Button>
        </div>
      </div>

      {apiError && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-600 px-4 py-3 rounded-md text-sm font-medium flex items-center">
          <span className="font-bold mr-2">¡Aviso!</span> {apiError}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-md text-sm font-mono flex items-center">
          <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeEmployees.map((emp) => {
          const { years, months } = getSeniority(emp.entryDate);
          const hasOneYear = years >= 1;
          const balance = getBalance(emp.id);
          const availableDays = balance?.availableDays ?? emp.vacationsBalance;
          const isLoadingThis = loadingIds.has(emp.id);
          const canUse = hasOneYear && availableDays > 0;

          return (
            <Card
              key={emp.id}
              className={`ring-1 ring-border/50 border-none transition-all hover:scale-[1.02] ${
                hasOneYear ? 'bg-primary text-primary-foreground' : 'bg-card'
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className={`font-bold text-xl tracking-tight mb-1 ${hasOneYear ? 'text-primary-foreground' : ''}`}>
                      {emp.fullName}
                    </h3>
                    <p className={`text-sm font-medium ${hasOneYear ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {emp.area}
                    </p>
                  </div>
                  {hasOneYear ? (
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                      ELEGIBLE
                    </span>
                  ) : (
                    <Badge variant="outline" className="px-3 py-1 rounded-full text-xs font-bold bg-muted/50">
                      EN PROCESO
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 mb-8 bg-background/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex justify-between text-sm">
                    <span className={hasOneYear ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                      Antigüedad:
                    </span>
                    <span className="font-bold">
                      {years} años, {months} meses
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={hasOneYear ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                      Total días:
                    </span>
                    <span className="font-bold">{balance?.totalDays ?? '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={hasOneYear ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                      Usados:
                    </span>
                    <span className="font-bold">{balance?.usedDays ?? '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-white/10 pt-2">
                    <span className={hasOneYear ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                      Saldo disponible:
                    </span>
                    <span className="font-bold text-lg">{availableDays} días</span>
                  </div>
                </div>

                {hasOneYear ? (
                  <Button
                    className="w-full bg-white text-primary hover:bg-white/90 text-sm font-bold shadow-xl shadow-black/10 transition-transform hover:scale-[1.02]"
                    disabled={!canUse || isLoadingThis}
                    isLoading={isLoadingThis}
                    onClick={() => handleUseDays(emp.id, emp.fullName, 5)}
                  >
                    {canUse ? 'Usar 5 Días de Vacación' : 'Sin saldo disponible'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full text-sm font-bold border-border/50 text-muted-foreground"
                    disabled
                  >
                    Esperando 1 año
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
        {activeEmployees.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground">
            No hay empleados activos. Registre empleados primero.
          </div>
        )}
      </div>
    </div>
  );
}

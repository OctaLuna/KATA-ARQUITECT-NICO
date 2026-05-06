import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { differenceInYears, differenceInMonths, isValid } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';

export function VacationsFeature() {
  const { employees, updateEmployee } = useStore();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const activeEmployees = employees.filter(e => e.status === true);

  const getSeniority = (dateStr: string) => {
    const entryDate = new Date(dateStr);
    if (!isValid(entryDate)) return { years: 0, months: 0 };
    const now = new Date();
    const years = differenceInYears(now, entryDate);
    const totalMonths = differenceInMonths(now, entryDate);
    const remainingMonths = totalMonths % 12;
    return { years, months: remainingMonths };
  };

  const handleGrantVacation = async (empId: string, name: string) => {
    await updateEmployee(empId, { vacationsBalance: 15 });
    setSuccessMsg(`[LOG] 15 días de vacación habilitados para ${name}.`);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Módulo de Vacaciones</h1>
        <p className="text-muted-foreground mt-2">Visualización de saldos y antigüedad del personal.</p>
      </div>

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-md text-sm font-mono flex items-center mb-4">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {successMsg}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeEmployees.map(emp => {
          const { years, months } = getSeniority(emp.entryDate);
          const hasOneYear = years >= 1;
          const needsVacationGrant = hasOneYear && emp.vacationsBalance === 0;

          return (
            <Card key={emp.id} className={`ring-1 ring-border/50 border-none transition-all hover:scale-[1.02] ${hasOneYear ? "bg-primary text-primary-foreground" : "bg-card"}`}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className={`font-bold text-xl tracking-tight mb-1 ${hasOneYear ? "text-primary-foreground" : ""}`}>{emp.fullName}</h3>
                    <p className={`text-sm font-medium ${hasOneYear ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{emp.area}</p>
                  </div>
                  {hasOneYear ? (
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">ELEGIBLE</span>
                  ) : (
                    <Badge variant="outline" className="px-3 py-1 rounded-full text-xs font-bold bg-muted/50">EN PROCESO</Badge>
                  )}
                </div>

                <div className="space-y-3 mb-8 bg-background/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex justify-between text-sm">
                    <span className={hasOneYear ? "text-primary-foreground/80" : "text-muted-foreground"}>Antigüedad:</span>
                    <span className="font-bold">{years} años, {months} meses</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={hasOneYear ? "text-primary-foreground/80" : "text-muted-foreground"}>Saldo:</span>
                    <span className="font-bold">{emp.vacationsBalance} días</span>
                  </div>
                </div>

                {hasOneYear ? (
                  <Button 
                    className="w-full bg-white text-primary hover:bg-white/90 text-sm font-bold shadow-xl shadow-black/10 transition-transform hover:scale-[1.02]" 
                    disabled={!needsVacationGrant}
                    onClick={() => handleGrantVacation(emp.id, emp.fullName)}
                  >
                    Habilitar 15 Días
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
          )
        })}
        {activeEmployees.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground">
            No hay empleados activos.
          </div>
        )}
      </div>
    </div>
  );
}

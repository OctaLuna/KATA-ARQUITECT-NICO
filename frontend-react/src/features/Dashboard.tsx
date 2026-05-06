import React from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { differenceInYears } from 'date-fns';

export function Dashboard() {
  const employees = useStore((state) => state.employees);
  const activeEmployees = employees.filter(e => e.status === true);
  
  const vacationsAlerts = activeEmployees.filter(e => differenceInYears(new Date(), new Date(e.entryDate)) >= 1);

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center justify-center text-center py-10 bg-primary/5 rounded-[32px] border border-primary/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl bg-primary/20 blur-[100px] pointer-events-none rounded-full" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 relative z-10">
          Gestión de Recursos<br />Humanos Eficiente
        </h1>
        <p className="text-muted-foreground max-w-lg mb-8 relative z-10">
          Administre el ciclo de vida del personal, vacaciones, y planillas de pago con un sistema ágil y seguro.
        </p>
        <div className="flex gap-4 relative z-10">
          <Button size="lg" className="px-8">
            Ir a Funcionarios
          </Button>
          <Button size="lg" variant="outline" className="px-8 border-primary/20 hover:bg-primary/5 text-foreground">
            Ver Reportes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-card to-card border-none ring-1 ring-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Funcionarios Activos</CardTitle>
            <div className="h-8 w-8 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tighter">{activeEmployees.length}</div>
            <p className="text-sm text-muted-foreground mt-2 flex items-center bg-green-500/10 text-green-600 dark:text-green-400 w-fit px-2 py-0.5 rounded-full">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Estado óptimo
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Alertas de Vacaciones</CardTitle>
            <div className="h-8 w-8 bg-white/20 text-white rounded-full flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tighter">{vacationsAlerts.length}</div>
            <p className="text-sm mt-2 text-primary-foreground/80">
              Empleados con &gt; 1 año de antigüedad
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#24223a] text-white border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Registros</CardTitle>
            <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center text-white">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-bold tracking-tighter">{employees.length}</div>
             <p className="text-sm text-white/80 mt-2">
              Histórico en base de datos
             </p>
          </CardContent>
        </Card>
      </div>

      <Card className="ring-1 ring-border/50 border-none">
        <CardHeader>
          <CardTitle className="text-xl">Últimos Funcionarios Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {employees.slice(-4).reverse().map(emp => (
              <div key={emp.id} className="flex items-center justify-between border-border pb-4 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground uppercase">
                    {emp.fullName.charAt(0)}{emp.fullName.split(' ')[1]?.charAt(0) || ''}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{emp.fullName}</p>
                    <p className="text-sm text-muted-foreground font-medium">{emp.position}</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 text-xs font-semibold rounded-full ${emp.status === true ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {emp.status ? 'Activo' : 'Inactivo'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

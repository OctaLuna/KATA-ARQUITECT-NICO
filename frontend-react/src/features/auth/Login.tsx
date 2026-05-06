import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Building2, Lock, User, Sun, Moon, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const { theme, toggleTheme } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Credenciales incorrectas. Verifique e intente nuevamente.');
      } else {
        setError('No se pudo conectar con auth-service (localhost:5000). Verifique que el servicio esté activo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden transition-colors duration-500">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-card/80 backdrop-blur-md border border-border/50 hover:bg-muted text-foreground transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-indigo-500" />}
        </button>
      </div>

      {/* Modern Background Effects */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/3 transition-all duration-1000" />
      <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-blue-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] opacity-60 pointer-events-none -translate-x-1/3 translate-y-1/3 transition-all duration-1000" />
      
      <div className="w-full max-w-md p-6 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center mb-8 relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
          <div className="relative flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl shadow-primary/30 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Building2 className="h-10 w-10" />
          </div>
        </div>
        
        <Card className="w-full flex-col flex bg-card/80 backdrop-blur-2xl border-white/10 dark:border-white/5 ring-1 ring-border/50 shadow-2xl p-8 space-y-8 rounded-[32px]">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              ARCA Workspace
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Gestión Humana & Microservicios
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Usuario
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <Input 
                  placeholder="admin HR" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-12 h-14 bg-background/50 border-border/50 focus:bg-background rounded-xl transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <Input 
                  type="password"
                  placeholder="•••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 bg-background/50 border-border/50 focus:bg-background rounded-xl transition-all"
                />
              </div>
            </div>
            
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center animate-in zoom-in-95">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full h-14 text-base font-bold rounded-xl group relative overflow-hidden" isLoading={isLoading}>
              <span className="relative z-10 flex items-center justify-center">
                Acceder al Sistema <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-muted/50 border border-border/50 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              <span className="text-xs font-semibold text-muted-foreground">Servicios Operativos</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

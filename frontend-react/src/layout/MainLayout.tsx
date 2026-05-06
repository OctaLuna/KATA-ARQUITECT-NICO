import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Sun, 
  Moon, 
  Calendar, 
  FileText, 
  DollarSign, 
  LayoutDashboard,
  LogOut,
  Building2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';

export function MainLayout() {
  const { theme, toggleTheme } = useStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Empleados', href: '/employees', icon: Users },
    { name: 'Vacaciones', href: '/vacations', icon: Calendar },
    { name: 'Contratos', href: '/contracts', icon: FileText },
    { name: 'Planillas', href: '/payroll', icon: DollarSign },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-sidebar flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-8 border-b border-border/50">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground mr-3 shadow-lg shadow-primary/20">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold tracking-tighter">ARCA</span>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
            Menu Principal
          </div>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                    : "text-sidebar-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="flex items-center p-3 rounded-2xl border border-border/50 bg-card">
            <div className="h-10 w-10 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3">
              {user?.name?.substring(0, 2).toUpperCase() || 'HR'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name || 'Admin HR'}</p>
              <p className="text-xs text-muted-foreground truncate">Recursos Humanos</p>
            </div>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground p-2">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-8 bg-background/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex md:hidden items-center">
             <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground mr-3">
               <Building2 className="h-4 w-4" />
             </div>
             <span className="text-xl font-bold tracking-tighter">ARCA</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={handleLogout} className="md:hidden flex items-center p-3 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-6 pb-6 md:px-10 md:pb-10 relative">
          <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-60 pointer-events-none translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] opacity-60 pointer-events-none -translate-x-1/2 translate-y-1/2" />
          <div className="max-w-6xl mx-auto mt-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

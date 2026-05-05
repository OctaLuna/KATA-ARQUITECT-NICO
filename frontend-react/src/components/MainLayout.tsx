import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, FileText, DollarSign, Hexagon } from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Personal', icon: Users },
    { path: '/vacaciones', label: 'Vacaciones', icon: Calendar },
    { path: '/contratos', label: 'Contratos', icon: FileText },
    { path: '/boletas', label: 'Boletas de Pago', icon: DollarSign },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Hexagon size={40} color="var(--primary-color)" />
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ARCA LTDA</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gestión Humana MVP</p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} className={isActive ? 'animate-fade-in' : ''} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              AD
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Admin</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tecnología</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

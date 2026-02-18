
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  LogOut, 
  Plus, 
  Clock, 
  UserCircle,
  Menu,
  X,
  ShieldCheck,
  Settings
} from 'lucide-react';
import LoginForm from './components/LoginForm';
import StaffManagement from './components/StaffManagement';
import AttendanceRegistry from './components/AttendanceRegistry';
import Reports from './components/Reports';
import Dashboard from './components/Dashboard';
import PrefectManagement from './components/PrefectManagement';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (loggedUser: UserProfile) => {
    setUser(loggedUser);
    localStorage.setItem('currentUser', JSON.stringify(loggedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/asistencia" element={<AttendanceRegistry />} />
            <Route path="/personal" element={<StaffManagement />} />
            <Route path="/reportes" element={<Reports />} />
            {user.rol === 'director' && (
              <Route path="/usuarios" element={<PrefectManagement />} />
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

interface SidebarProps {
  user: UserProfile;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/asistencia', label: 'Registro Diario', icon: <Calendar className="w-5 h-5" /> },
    { path: '/personal', label: 'Gestión Personal', icon: <Users className="w-5 h-5" /> },
    { path: '/reportes', label: 'Reportes', icon: <Clock className="w-5 h-5" /> },
  ];

  if (user.rol === 'director') {
    navItems.push({ path: '/usuarios', label: 'Gestión Prefectos', icon: <ShieldCheck className="w-5 h-5" /> });
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-indigo-700 text-white shadow-md">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6" />
          <span className="font-bold">ControlHorarios MS</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Actual Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-64 bg-indigo-800 text-indigo-100 z-50 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-xl
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-indigo-700/50">
          <div className="bg-white p-2 rounded-lg">
            <Clock className="w-6 h-6 text-indigo-800" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">Moisés Sáenz</span>
            <span className="text-xs text-indigo-300 uppercase tracking-wider">Tingambato</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${location.pathname === item.path 
                  ? 'bg-indigo-700 text-white shadow-inner' 
                  : 'hover:bg-indigo-700/50 hover:text-white'}
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-700/50">
          <div className="flex items-center gap-3 px-4 py-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user.rol === 'director' ? 'bg-amber-400 text-amber-900' : 'bg-indigo-400 text-indigo-900'}`}>
              {user.nombre.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">{user.nombre}</span>
              <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-tight">{user.rol}</span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-300 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default App;

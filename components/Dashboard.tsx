
import React from 'react';
import { Users, AlertCircle, CheckCircle2, CalendarDays, TrendingUp, ShieldCheck } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { UserProfile } from '../types';

const data = [
  { name: 'Lun', faltas: 2, retardos: 5 },
  { name: 'Mar', faltas: 1, retardos: 8 },
  { name: 'Mie', faltas: 3, retardos: 4 },
  { name: 'Jue', faltas: 0, retardos: 6 },
  { name: 'Vie', faltas: 4, retardos: 2 },
];

interface DashboardProps {
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Bienvenido, {user.rol === 'director' ? 'Director ' : ''}{user.nombre}
          </h1>
          <p className="text-slate-500">Escuela Secundaria Moisés Sáenz - Panel de {user.rol}</p>
        </div>
        {user.rol === 'director' && (
          <div className="hidden md:flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-bold text-amber-700">Acceso Administrativo</span>
          </div>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Users className="text-blue-600" />} 
          label="Personal Total" 
          value="42" 
          change="+2 este mes"
          bgColor="bg-blue-50"
        />
        <StatCard 
          icon={<CheckCircle2 className="text-emerald-600" />} 
          label="Asistencias Hoy" 
          value="38" 
          change="90.4% puntualidad"
          bgColor="bg-emerald-50"
        />
        <StatCard 
          icon={<AlertCircle className="text-amber-600" />} 
          label="Retardos Hoy" 
          value="3" 
          change="-1 vs ayer"
          bgColor="bg-amber-50"
        />
        <StatCard 
          icon={<CalendarDays className="text-rose-600" />} 
          label="Faltas Hoy" 
          value="1" 
          change="Sin cambios"
          bgColor="bg-rose-50"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Incidencias Semanales
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="retardos" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="faltas" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Acciones del Día</h3>
          <div className="space-y-3">
            <QuickActionButton 
              label="Registrar Asistencias" 
              desc="Acceder al control diario" 
              color="indigo" 
              to="/asistencia" 
            />
            {user.rol === 'director' && (
              <QuickActionButton 
                label="Gestionar Prefectos" 
                desc="Administrar cuentas de acceso" 
                color="amber" 
                to="/usuarios" 
              />
            )}
            <QuickActionButton 
              label="Ver Reporte Mensual" 
              desc="Análisis de cumplimiento" 
              color="emerald" 
              to="/reportes" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, change, bgColor }: { icon: React.ReactNode, label: string, value: string, change: string, bgColor: string }) => (
  <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
    <div className={`p-3 rounded-2xl ${bgColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900 my-0.5">{value}</h4>
      <p className="text-xs font-semibold text-slate-400">{change}</p>
    </div>
  </div>
);

const QuickActionButton = ({ label, desc, color, to }: { label: string, desc: string, color: string, to: string }) => {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100',
  };
  return (
    <a href={`#${to}`} className={`block p-4 rounded-2xl border ${colors[color]} transition-colors`}>
      <p className="font-bold text-sm">{label}</p>
      <p className="text-xs opacity-80">{desc}</p>
    </a>
  );
}

export default Dashboard;

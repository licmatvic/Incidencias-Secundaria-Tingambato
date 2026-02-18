
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { FileText, Download, Filter, TrendingDown, Users } from 'lucide-react';

const staffSummary = [
  { name: 'María García', puntuales: 18, retardos: 2, faltas: 0, minutos: 45 },
  { name: 'Juan Pérez', puntuales: 15, retardos: 4, faltas: 1, minutos: 120 },
  { name: 'Ricardo Sánchez', puntuales: 19, retardos: 1, faltas: 0, minutos: 15 },
  { name: 'Lucía Méndez', puntuales: 14, retardos: 3, faltas: 3, minutos: 85 },
  { name: 'Pedro Ortiz', puntuales: 20, retardos: 0, faltas: 0, minutos: 0 },
];

const COLORS = ['#10b981', '#f59e0b', '#f43f5e'];

const Reports: React.FC = () => {
  const [period, setPeriod] = useState('2026-02');

  const pieData = [
    { name: 'Asistencias', value: staffSummary.reduce((acc, curr) => acc + curr.puntuales, 0) },
    { name: 'Retardos', value: staffSummary.reduce((acc, curr) => acc + curr.retardos, 0) },
    { name: 'Faltas', value: staffSummary.reduce((acc, curr) => acc + curr.faltas, 0) },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Reportes de Asistencia</h1>
          <p className="text-slate-500">Análisis mensual de puntualidad y cumplimiento</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="month" 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none"
          />
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </header>

      {/* Top Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-indigo-500" />
            Comparativa de Incidencias por Personal
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffSummary} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={100} 
                  tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="retardos" name="Retardos" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                <Bar dataKey="faltas" name="Faltas" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Distribución General del Mes
          </h3>
          <div className="h-80 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Detalle Acumulado Mensual</h3>
          <button className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline">
            <Filter className="w-4 h-4" />
            Filtros Avanzados
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Empleado</th>
                <th className="px-6 py-4">Asistencias</th>
                <th className="px-6 py-4">Retardos</th>
                <th className="px-6 py-4">Faltas</th>
                <th className="px-6 py-4">Tiempo Perdido</th>
                <th className="px-6 py-4 text-right">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {staffSummary.map((staff, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{staff.name}</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">{staff.puntuales}</td>
                  <td className="px-6 py-4 text-amber-600 font-bold">{staff.retardos}</td>
                  <td className="px-6 py-4 text-rose-600 font-bold">{staff.faltas}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {Math.floor(staff.minutos / 60)}h {staff.minutos % 60}m
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      staff.faltas > 2 ? 'bg-rose-100 text-rose-700' :
                      staff.retardos > 3 ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {staff.faltas > 2 ? 'Crítico' : staff.retardos > 3 ? 'Advertencia' : 'Excelente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;

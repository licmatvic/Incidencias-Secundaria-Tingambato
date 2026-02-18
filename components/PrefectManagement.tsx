
import React, { useState, useEffect } from 'react';
/* Added Plus to the imports from lucide-react */
import { ShieldCheck, UserPlus, Mail, Trash2, Edit2, X, Check, Lock, ShieldAlert, Plus } from 'lucide-react';
import { UserProfile } from '../types';

const INITIAL_PREFECTS: UserProfile[] = [
  { id: 'p1', email: 'prefecto_manana@escuela.edu.mx', nombre: 'Carlos Ruiz', rol: 'prefecto' },
  { id: 'p2', email: 'prefecto_tarde@escuela.edu.mx', nombre: 'Ana Valdés', rol: 'prefecto' },
];

const PrefectManagement: React.FC = () => {
  const [prefects, setPrefects] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('school_prefects');
    return saved ? JSON.parse(saved) : INITIAL_PREFECTS;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });

  useEffect(() => {
    localStorage.setItem('school_prefects', JSON.stringify(prefects));
  }, [prefects]);

  const handleAddPrefect = () => {
    if (prefects.length >= 3) {
      alert("Límite de prefectos alcanzado (máximo 3).");
      return;
    }
    const newPrefect: UserProfile = {
      id: 'pref-' + Date.now(),
      nombre: formData.nombre,
      email: formData.email,
      rol: 'prefecto'
    };
    setPrefects([...prefects, newPrefect]);
    setIsModalOpen(false);
    setFormData({ nombre: '', email: '', password: '' });
  };

  const removePrefect = (id: string) => {
    if (confirm("¿Está seguro de revocar el acceso a este prefecto?")) {
      setPrefects(prefects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
            <ShieldCheck className="text-indigo-600" />
            Gestión de Accesos (Prefectos)
          </h1>
          <p className="text-slate-500">Administración de credenciales para el sistema</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={prefects.length >= 3}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:bg-slate-400"
        >
          <UserPlus className="w-5 h-5" />
          Generar Nuevo Acceso
        </button>
      </header>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-3xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800 leading-relaxed">
          Como **Director**, usted es el responsable de generar las cuentas para los prefectos. 
          Recuerde que el sistema está optimizado para un máximo de **3 usuarios concurrentes**.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prefects.map((prefect) => (
          <div key={prefect.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xl">
                {prefect.nombre.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{prefect.nombre}</h3>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Prefecto</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Mail className="w-4 h-4" />
                {prefect.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Lock className="w-4 h-4" />
                •••••••• (Activo)
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex gap-2">
              <button 
                onClick={() => removePrefect(prefect.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-rose-600 font-bold bg-rose-50 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Revocar Acceso
              </button>
            </div>
          </div>
        ))}
        
        {prefects.length < 3 && Array.from({ length: 3 - prefects.length }).map((_, i) => (
          <div key={`empty-${i}`} className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-slate-400">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium">Espacio disponible para prefecto</p>
          </div>
        ))}
      </div>

      {/* Modal Nueva Cuenta */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="text-indigo-600" />
                Nuevo Acceso
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre del Prefecto</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Correo Institucional</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="prefecto@escuela.edu.mx"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña Temporal</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Asigne una contraseña"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddPrefect}
                disabled={!formData.nombre || !formData.email}
                className="flex-1 py-3 bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
              >
                Habilitar Acceso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrefectManagement;

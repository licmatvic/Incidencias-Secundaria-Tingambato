
import React, { useState } from 'react';
import { Clock, ShieldCheck, Mail, Lock, UserCog } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginFormProps {
  onLogin: (user: UserProfile) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('director@escuela.edu.mx');
  const [password, setPassword] = useState('director123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Lógica de simulación de acceso
    setTimeout(() => {
      let loggedUser: UserProfile;
      
      if (email.includes('director')) {
        loggedUser = {
          id: 'dir-01',
          email: 'director@escuela.edu.mx',
          nombre: 'Victor Tovar',
          rol: 'director'
        };
      } else {
        loggedUser = {
          id: 'pref-' + Date.now(),
          email: email,
          nombre: 'Prefecto de Turno',
          rol: 'prefecto'
        };
      }
      
      onLogin(loggedUser);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center bg-indigo-50 border-b border-indigo-100">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">ControlHorarios MS</h1>
          <p className="text-slate-500 mt-1">Escuela Secundaria Federal "Moisés Sáenz"</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  placeholder="ejemplo@escuela.edu.mx"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div className="px-8 pb-8 text-center space-y-2">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Modo de Acceso Demo</p>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => { setEmail('director@escuela.edu.mx'); setPassword('director123'); }}
              className="text-[10px] bg-slate-100 px-2 py-1 rounded hover:bg-indigo-100 text-slate-600"
            >
              Director
            </button>
            <button 
              onClick={() => { setEmail('prefecto1@escuela.edu.mx'); setPassword('prefecto123'); }}
              className="text-[10px] bg-slate-100 px-2 py-1 rounded hover:bg-indigo-100 text-slate-600"
            >
              Prefecto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

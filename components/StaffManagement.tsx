
import React, { useState, useEffect } from 'react';
import { Staff, ContractType } from '../types';
import { Search, UserPlus, Edit2, Trash2, Check, X, Filter } from 'lucide-react';

const INITIAL_STAFF: Staff[] = [
  { id: '1', nombre_completo: 'María García López', tipo_contrato: ContractType.JORNADA, hora_entrada: '08:00', hora_salida: '15:00', activo: true, created_at: new Date().toISOString() },
  { id: '2', nombre_completo: 'Juan Pérez Rodríguez', tipo_contrato: ContractType.HORAS, horas_semanales: 30, activo: true, created_at: new Date().toISOString() },
  { id: '3', nombre_completo: 'Ricardo Sánchez Ruiz', tipo_contrato: ContractType.JORNADA, hora_entrada: '07:30', hora_salida: '14:30', activo: true, created_at: new Date().toISOString() },
];

const StaffManagement: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('school_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nombre_completo: '',
    tipo_contrato: ContractType.JORNADA,
    hora_entrada: '08:00',
    hora_salida: '15:00',
    horas_semanales: 40
  });

  useEffect(() => {
    localStorage.setItem('school_staff', JSON.stringify(staffList));
  }, [staffList]);

  const filteredStaff = staffList.filter(s => 
    s.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (staff?: Staff) => {
    if (staff) {
      setEditingStaff(staff);
      setFormData({
        nombre_completo: staff.nombre_completo,
        tipo_contrato: staff.tipo_contrato,
        hora_entrada: staff.hora_entrada || '08:00',
        hora_salida: staff.hora_salida || '15:00',
        horas_semanales: staff.horas_semanales || 40
      });
    } else {
      setEditingStaff(null);
      setFormData({
        nombre_completo: '',
        tipo_contrato: ContractType.JORNADA,
        hora_entrada: '08:00',
        hora_salida: '15:00',
        horas_semanales: 40
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nombre_completo) return;

    if (editingStaff) {
      setStaffList(prev => prev.map(s => s.id === editingStaff.id ? { 
        ...s, 
        ...formData,
        hora_entrada: formData.tipo_contrato === ContractType.JORNADA ? formData.hora_entrada : undefined,
        hora_salida: formData.tipo_contrato === ContractType.JORNADA ? formData.hora_salida : undefined,
        horas_semanales: formData.tipo_contrato === ContractType.HORAS ? formData.horas_semanales : undefined,
      } : s));
    } else {
      const newStaff: Staff = {
        id: Date.now().toString(),
        nombre_completo: formData.nombre_completo,
        tipo_contrato: formData.tipo_contrato,
        hora_entrada: formData.tipo_contrato === ContractType.JORNADA ? formData.hora_entrada : undefined,
        hora_salida: formData.tipo_contrato === ContractType.JORNADA ? formData.hora_salida : undefined,
        horas_semanales: formData.tipo_contrato === ContractType.HORAS ? formData.horas_semanales : undefined,
        activo: true,
        created_at: new Date().toISOString()
      };
      setStaffList(prev => [...prev, newStaff]);
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, activo: !s.activo } : s));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Catálogo de Personal</h1>
          <p className="text-slate-500">Gestión de docentes y administrativos</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <UserPlus className="w-5 h-5" />
          Registrar Personal
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-medium">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contrato</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Horario / Horas</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Estatus</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                        {staff.nombre_completo.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800">{staff.nombre_completo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      staff.tipo_contrato === ContractType.JORNADA 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                    }`}>
                      {staff.tipo_contrato}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {staff.tipo_contrato === ContractType.JORNADA 
                      ? `${staff.hora_entrada} - ${staff.hora_salida}` 
                      : `${staff.horas_semanales} hrs/semana`}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(staff.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        staff.activo 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${staff.activo ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                      {staff.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(staff)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleStatus(staff.id)}
                        className={`p-2 rounded-lg transition-colors ${staff.activo ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                      >
                        {staff.activo ? <Trash2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStaff.length === 0 && (
            <div className="py-12 text-center text-slate-400 font-medium">
              No se encontraron resultados para "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">
                {editingStaff ? 'Editar Empleado' : 'Nuevo Empleado'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre Completo</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})}
                  placeholder="Ej. Juan Pérez López"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Contrato</label>
                <div className="flex gap-2 p-1 bg-slate-50 rounded-xl">
                  {Object.values(ContractType).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({...formData, tipo_contrato: type})}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all capitalize ${
                        formData.tipo_contrato === type 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {formData.tipo_contrato === ContractType.JORNADA ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Hora Entrada</label>
                    <input 
                      type="time" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all"
                      value={formData.hora_entrada}
                      onChange={(e) => setFormData({...formData, hora_entrada: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Hora Salida</label>
                    <input 
                      type="time" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all"
                      value={formData.hora_salida}
                      onChange={(e) => setFormData({...formData, hora_salida: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Horas Semanales</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all"
                    value={formData.horas_semanales}
                    onChange={(e) => setFormData({...formData, horas_semanales: parseInt(e.target.value)})}
                  />
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={!formData.nombre_completo}
                className="flex-1 py-3 bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;

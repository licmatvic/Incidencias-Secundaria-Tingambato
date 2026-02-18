
import React, { useState, useEffect } from 'react';
import { Staff, AttendanceRecord, AttendanceStatus, ContractType } from '../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Clock, 
  Undo2, 
  Save, 
  Calendar, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp,
  X,
  Plus,
  Minus
} from 'lucide-react';

const GROUPS = [
  '1A', '1B', '1C', '1D', '1E',
  '2A', '2B', '2C', '2D', '2E',
  '3A', '3B', '3C', '3D', '3E'
];

const AttendanceRegistry: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [records, setRecords] = useState<Record<string, AttendanceRecord>>({});
  const [expandedStaff, setExpandedStaff] = useState<Record<string, boolean>>({});
  
  const [timePickerData, setTimePickerData] = useState<{
    staffId: string;
    nombre: string;
    modulo?: number;
    minutes: number;
  } | null>(null);

  useEffect(() => {
    const savedStaff = localStorage.getItem('school_staff');
    if (savedStaff) {
      const activeStaff = JSON.parse(savedStaff).filter((s: Staff) => s.activo);
      setStaffList(activeStaff);
    }

    const savedRecords = localStorage.getItem(`attendance_${currentDate}`);
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    } else {
      setRecords({});
    }
  }, [currentDate]);

  const saveToStorage = (updatedRecords: Record<string, AttendanceRecord>) => {
    localStorage.setItem(`attendance_${currentDate}`, JSON.stringify(updatedRecords));
    setRecords(updatedRecords);
  };

  const getRecordKey = (staffId: string, modulo?: number) => {
    return modulo ? `${staffId}_mod_${modulo}` : `${staffId}_daily`;
  };

  const handleStatusChange = (staffId: string, status: AttendanceStatus, modulo?: number) => {
    const staff = staffList.find(s => s.id === staffId);
    if (!staff) return;

    if (status === AttendanceStatus.RETARDO) {
      setTimePickerData({ 
        staffId, 
        nombre: staff.nombre_completo, 
        modulo,
        minutes: 5
      });
      return;
    }

    const key = getRecordKey(staffId, modulo);
    const existing = records[key] || {};

    const newRecord: AttendanceRecord = {
      id: existing.id || Date.now().toString(),
      personal_id: staffId,
      fecha: currentDate,
      modulo,
      estado: status,
      minutos_retardo: 0,
      grupo: existing.grupo || GROUPS[0],
      observaciones: existing.observaciones || '',
      registrado_por: 'prefecto-1',
      created_at: existing.created_at || new Date().toISOString()
    };

    saveToStorage({ ...records, [key]: newRecord });
  };

  const handleRetardoConfirm = () => {
    if (!timePickerData) return;
    
    const { staffId, modulo, minutes } = timePickerData;
    const key = getRecordKey(staffId, modulo);
    const existing = records[key] || {};

    const newRecord: AttendanceRecord = {
      id: existing.id || Date.now().toString(),
      personal_id: staffId,
      fecha: currentDate,
      modulo,
      estado: AttendanceStatus.RETARDO,
      minutos_retardo: minutes,
      grupo: existing.grupo || GROUPS[0],
      observaciones: existing.observaciones || '',
      registrado_por: 'prefecto-1',
      created_at: existing.created_at || new Date().toISOString()
    };

    saveToStorage({ ...records, [key]: newRecord });
    setTimePickerData(null);
  };

  const updateRecordField = (staffId: string, modulo: number | undefined, field: 'grupo' | 'observaciones', value: string) => {
    const key = getRecordKey(staffId, modulo);
    if (!records[key]) return;
    
    const updated = { ...records[key], [field]: value };
    saveToStorage({ ...records, [key]: updated });
  };

  const resetRecord = (staffId: string, modulo?: number) => {
    const key = getRecordKey(staffId, modulo);
    const newRecords = { ...records };
    delete newRecords[key];
    saveToStorage(newRecords);
  };

  const toggleExpand = (staffId: string) => {
    setExpandedStaff(prev => ({ ...prev, [staffId]: !prev[staffId] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Registro de incidencias</h1>
          <p className="text-slate-500">Gestión de incidencias diarias - Secundaria Moisés Sáenz</p>
        </div>
        <div className="relative group">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
          <input 
            type="date" 
            className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 shadow-sm transition-all"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
          />
        </div>
      </header>

      <div className="space-y-4">
        {staffList.map((staff) => {
          const isHourly = staff.tipo_contrato === ContractType.HORAS;
          const isExpanded = expandedStaff[staff.id];

          return (
            <div key={staff.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all">
              <div className="p-5 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg
                    ${isHourly ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}
                  `}>
                    {staff.nombre_completo.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{staff.nombre_completo}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        isHourly ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {staff.tipo_contrato}
                      </span>
                      {staff.hora_entrada && (
                        <span className="text-xs text-slate-400 font-medium">Horario: {staff.hora_entrada} - {staff.hora_salida}</span>
                      )}
                    </div>
                  </div>
                </div>

                {isHourly ? (
                  <button 
                    onClick={() => toggleExpand(staff.id)}
                    className="flex items-center gap-2 px-4 py-2 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    {isExpanded ? 'Ocultar Módulos' : 'Ver Módulos'}
                  </button>
                ) : (
                  <DailyEntry 
                    staff={staff} 
                    record={records[getRecordKey(staff.id)]}
                    onStatusChange={(status) => handleStatusChange(staff.id, status)}
                    onReset={() => resetRecord(staff.id)}
                    onUpdateField={(field, val) => updateRecordField(staff.id, undefined, field, val)}
                  />
                )}
              </div>

              {isHourly && isExpanded && (
                <div className="p-5 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                      const key = getRecordKey(staff.id, num);
                      const record = records[key];

                      return (
                        <div key={num} className={`p-4 rounded-2xl border transition-all ${record ? 'bg-white shadow-sm border-indigo-100' : 'bg-slate-100/50 border-slate-200'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">Módulo {num}</span>
                            {record && (
                              <button onClick={() => resetRecord(staff.id, num)} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors">
                                <Undo2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {!record ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleStatusChange(staff.id, AttendanceStatus.ASISTENCIA, num)} className="flex-1 p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle2 className="w-4 h-4 mx-auto" /></button>
                              <button onClick={() => handleStatusChange(staff.id, AttendanceStatus.RETARDO, num)} className="flex-1 p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-600 hover:text-white transition-all"><Clock className="w-4 h-4 mx-auto" /></button>
                              <button onClick={() => handleStatusChange(staff.id, AttendanceStatus.FALTA, num)} className="flex-1 p-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><XCircle className="w-4 h-4 mx-auto" /></button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                {record.estado === AttendanceStatus.ASISTENCIA && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                {record.estado === AttendanceStatus.RETARDO && <Clock className="w-4 h-4 text-amber-500" />}
                                {record.estado === AttendanceStatus.FALTA && <XCircle className="w-4 h-4 text-rose-500" />}
                                <span className={`text-xs font-bold uppercase ${
                                  record.estado === AttendanceStatus.ASISTENCIA ? 'text-emerald-700' :
                                  record.estado === AttendanceStatus.RETARDO ? 'text-amber-700' : 'text-rose-700'
                                }`}>
                                  {record.estado === AttendanceStatus.RETARDO && record.minutos_retardo > 0 ? `Retardo (${record.minutos_retardo}m)` : record.estado}
                                </span>
                              </div>

                              <select 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs py-1.5 px-2 outline-none focus:border-indigo-600"
                                value={record.grupo}
                                onChange={(e) => updateRecordField(staff.id, num, 'grupo', e.target.value)}
                              >
                                {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                              </select>

                              <textarea 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-[10px] p-2 outline-none focus:border-indigo-600 resize-none h-10"
                                placeholder="Notas..."
                                value={record.observaciones}
                                onChange={(e) => updateRecordField(staff.id, num, 'observaciones', e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center py-8">
        <button className="flex items-center gap-2 px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-100 transition-all transform active:scale-95">
          <Save className="w-6 h-6" />
          Finalizar Registro del Día
        </button>
      </div>

      {/* MODAL DE MINUTOS DE RETARDO (CENTRADOS) */}
      {timePickerData && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 text-center border-b border-slate-100">
              <div className="inline-flex p-4 bg-amber-50 text-amber-600 rounded-3xl mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Minutos de Retardo</h3>
              <p className="text-sm text-slate-500 font-medium truncate mt-1 opacity-80">{timePickerData.nombre}</p>
            </div>

            <div className="p-10 bg-slate-50/50">
              <div className="flex flex-col items-center">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                  Cantidad a Registrar
                </label>
                
                {/* CONTENEDOR DE ENTRADA CON CENTRADO ABSOLUTO */}
                <div className="flex items-center justify-center gap-6 w-full">
                  <button 
                    onClick={() => setTimePickerData({...timePickerData, minutes: Math.max(0, timePickerData.minutes - 1)})}
                    className="w-16 h-16 flex items-center justify-center bg-white text-slate-600 rounded-[24px] border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-90 transition-all"
                  >
                    <Minus className="w-8 h-8" />
                  </button>
                  
                  {/* INPUT NUMÉRICO CENTRADO CON ANCHO FIJO */}
                  <div className="flex justify-center">
                    <input 
                      type="number" 
                      className="w-32 text-7xl font-black text-center text-slate-900 bg-transparent border-none outline-none focus:ring-0 p-0 m-0"
                      value={timePickerData.minutes}
                      onChange={(e) => setTimePickerData({...timePickerData, minutes: parseInt(e.target.value) || 0})}
                      autoFocus
                    />
                  </div>
                  
                  <button 
                    onClick={() => setTimePickerData({...timePickerData, minutes: timePickerData.minutes + 1})}
                    className="w-16 h-16 flex items-center justify-center bg-indigo-600 text-white rounded-[24px] shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-90 transition-all"
                  >
                    <Plus className="w-8 h-8" />
                  </button>
                </div>
                
                <div className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Use el teclado o los botones
                </div>
              </div>
            </div>

            <div className="p-8 flex gap-4">
              <button 
                onClick={() => setTimePickerData(null)}
                className="flex-1 py-5 text-slate-500 font-black uppercase text-xs tracking-widest hover:bg-slate-100 rounded-3xl transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleRetardoConfirm}
                className="flex-1 py-5 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-3xl shadow-xl shadow-slate-200 hover:bg-black transition-all transform active:scale-95"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DailyEntryProps {
  staff: Staff;
  record?: AttendanceRecord;
  onStatusChange: (status: AttendanceStatus) => void;
  onReset: () => void;
  onUpdateField: (field: 'grupo' | 'observaciones', val: string) => void;
}

const DailyEntry: React.FC<DailyEntryProps> = ({ staff, record, onStatusChange, onReset, onUpdateField }) => {
  if (!record) {
    return (
      <div className="flex gap-2">
        <button onClick={() => onStatusChange(AttendanceStatus.ASISTENCIA)} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all">
          <CheckCircle2 className="w-4 h-4" /> Asistencia
        </button>
        <button onClick={() => onStatusChange(AttendanceStatus.RETARDO)} className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl font-bold hover:bg-amber-600 hover:text-white transition-all">
          <Clock className="w-4 h-4" /> Retardo
        </button>
        <button onClick={() => onStatusChange(AttendanceStatus.FALTA)} className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-600 hover:text-white transition-all">
          <XCircle className="w-4 h-4" /> Falta
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className={`text-sm font-bold uppercase flex items-center gap-1.5 ${
            record.estado === AttendanceStatus.ASISTENCIA ? 'text-emerald-600' :
            record.estado === AttendanceStatus.RETARDO ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {record.estado === AttendanceStatus.ASISTENCIA && <CheckCircle2 className="w-4 h-4" />}
            {record.estado === AttendanceStatus.RETARDO && <Clock className="w-4 h-4" />}
            {record.estado === AttendanceStatus.FALTA && <XCircle className="w-4 h-4" />}
            {record.estado} {record.minutos_retardo > 0 ? `(${record.minutos_retardo}m)` : ''}
          </span>
        </div>
        <button onClick={onReset} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors" title="Deshacer">
          <Undo2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="hidden sm:flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 focus-within:border-indigo-200">
        <MessageSquare className="w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Observaciones..." 
          className="bg-transparent border-none outline-none text-xs w-28 placeholder:text-slate-300"
          value={record.observaciones}
          onChange={(e) => onUpdateField('observaciones', e.target.value)}
        />
      </div>
    </div>
  );
};

export default AttendanceRegistry;

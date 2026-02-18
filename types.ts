
export enum ContractType {
  JORNADA = 'jornada',
  HORAS = 'horas'
}

export enum AttendanceStatus {
  ASISTENCIA = 'asistencia',
  RETARDO = 'retardo',
  FALTA = 'falta'
}

export type UserRole = 'director' | 'prefecto';

export interface Staff {
  id: string;
  nombre_completo: string;
  tipo_contrato: ContractType;
  hora_entrada?: string; // HH:mm
  hora_salida?: string;  // HH:mm
  horas_semanales?: number;
  activo: boolean;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  personal_id: string;
  fecha: string; // YYYY-MM-DD
  modulo?: number; // 1-7 for hourly staff
  grupo?: string;  // e.g., 1A, 2B
  estado: AttendanceStatus;
  hora_llegada_real?: string; // HH:mm
  minutos_retardo: number;
  observaciones?: string;
  registrado_por: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
}

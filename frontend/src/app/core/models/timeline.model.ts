export type TimelineNodeType = 'TUTORIA' | 'ACUERDO' | 'TESIS' | 'EVIDENCIA' | 'PRODUCCION';

export interface TimelineParticipant {
  nombre: string;
  rol: string;
  asistencia: boolean;
  notas?: string;
}

export interface TimelineObservation {
  titulo: string;
  contenido: string;
  autor: string;
  created_at?: string;
}

export interface TimelineMetadata {
  session_id?: number;
  agreement_id?: number;
  progress_id?: number;
  evidence_id?: number;
  modalidad?: string;
  semestre?: string;
  responsable?: string;
  fecha_limite?: string;
  fecha_conclusion?: string;
  porcentaje_avance?: number;
  componentes_json?: Record<string, number>;
  observaciones?: string | TimelineObservation[];
  participantes?: TimelineParticipant[];
  tipo?: string;
  actividad_tipo?: string;
  actividad_id?: number;
  enlace_url?: string;
  archivo_url?: string;
  mime_type?: string;
  file_size_bytes?: number;
  cargado_por?: string;
  proxima_reunion_fecha?: string;
  proxima_reunion_notas?: string;
  [key: string]: any;
}

export interface TimelineEvent {
  id: string;
  tipo: TimelineNodeType;
  titulo: string;
  descripcion: string;
  fecha: string;
  estado: string;
  icono: string;
  color: string;
  metadata?: TimelineMetadata;
}

export interface TimelineResponse {
  student_id: number;
  total_eventos: number;
  timeline: TimelineEvent[];
}

export type AlertType = 'VENCIDO' | 'POR_VENCER' | 'FALTA_SEGUIMIENTO';
export type AlertSeverity = 'ALTA' | 'MEDIA' | 'BAJA';

export interface AlertItem {
  id: string;
  tipo: AlertType;
  titulo: string;
  mensaje: string;
  severidad: AlertSeverity;
  student_id: number;
  student_nombre?: string;
  fecha: string;
  metadata?: Record<string, any>;
}

export interface AlertsResponse {
  total_alertas: number;
  alertas: AlertItem[];
}

// Backward compatibility with previous draft
export interface TimelineNode extends TimelineEvent {
  type?: TimelineNodeType;
  title?: string;
  subtitle?: string;
  date?: string;
  semesterNumber?: number;
  badgeType?: 'PENDIENTE' | 'EN_PROCESO' | 'CONCLUIDO' | 'VENCIDO' | 'ACTIVO' | 'INFO' | 'SUCCESS';
  badgeText?: string;
  authorName?: string;
  authorRole?: string;
}

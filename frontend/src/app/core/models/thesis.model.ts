export interface ThesisComponents {
  protocolo: number;
  estadoArte: number;
  marcoTeorico: number;
  metodologia: number;
  analisis: number;
  redaccion: number;
}

export interface ThesisProgress {
  id: number;
  student: number;
  student_nombre?: string;
  student_matricula?: string;
  semester: number;
  semester_numero?: number;
  porcentaje_avance: number;
  componentes_json: ThesisComponents;
  observaciones: string;
  fecha_registro: string;
  created_at: string;
  updated_at: string;

  // CamelCase aliases
  studentId?: number;
  studentName?: string;
  studentMatricula?: string;
  semesterId?: number;
  semesterNumero?: number;
  currentPercentage?: number;
  percentage?: number;
  components?: ThesisComponents;
  summary?: string;
  observations?: string;
  registrationDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ThesisProgressCreateRequest {
  student: number;
  semester: number;
  porcentaje_avance: number;
  componentes_json?: ThesisComponents;
  observaciones?: string;
  fecha_registro?: string;
}

export interface ThesisProgressCreateResponse {
  thesis_progress_created_id: number;
  mensaje: string;
  thesis_progress: ThesisProgress;
}

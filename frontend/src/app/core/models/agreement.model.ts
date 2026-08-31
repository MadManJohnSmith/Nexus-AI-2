export type AgreementStatus = 'PENDIENTE' | 'EN_PROCESO' | 'CONCLUIDO' | 'VENCIDO';

export interface Agreement {
  id: number;
  studentId: number;
  tutoringSessionId?: number;
  semesterNumber: number;
  title: string;
  description: string;
  responsibleId: number;
  responsibleName: string;
  responsibleRole: string;
  dueDate: string;
  status: AgreementStatus;
  completionDate?: string;
  resolutionNotes?: string;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}

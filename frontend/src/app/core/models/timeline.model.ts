export type TimelineNodeType = 'TUTORIA' | 'ACUERDO' | 'TESIS' | 'EVIDENCIA' | 'PRODUCCION';

export interface TimelineNode {
  id: string;
  type: TimelineNodeType;
  title: string;
  subtitle?: string;
  description: string;
  date: string;
  semesterNumber: number;
  badgeType?: 'PENDIENTE' | 'EN_PROCESO' | 'CONCLUIDO' | 'VENCIDO' | 'ACTIVO' | 'INFO' | 'SUCCESS';
  badgeText?: string;
  authorName?: string;
  authorRole?: string;
  metadata?: Record<string, any>;
  icon?: string;
}

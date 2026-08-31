export interface ThesisProgress {
  id: number;
  studentId: number;
  semesterNumber: number;
  currentPercentage: number;
  chapterProgress: {
    chapterNumber: number;
    title: string;
    percentage: number;
    status: 'NO_INICIADO' | 'EN_REDACCION' | 'EN_REVISION' | 'APROBADO';
  }[];
  summary: string;
  updatedAt: string;
}

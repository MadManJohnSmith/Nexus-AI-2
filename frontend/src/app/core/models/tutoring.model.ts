export type TutoringModality = 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA';
export type TutoringStatus = 'PROGRAMADA' | 'REALIZADA' | 'CANCELADA';

export interface TutoringParticipant {
  id: number;
  userId: number;
  userName: string;
  userRole: string;
  attended: boolean;
}

export interface TutoringSession {
  id: number;
  studentId: number;
  semesterId: number;
  semesterNumber: number;
  sessionNumber: number;
  sessionDate: string;
  durationMinutes: number;
  modality: TutoringModality;
  locationOrLink?: string;
  status: TutoringStatus;
  objectivesDiscussed: string;
  progressNotes: string;
  observations: string;
  nextMeetingDate?: string;
  participants: TutoringParticipant[];
  agreementsCount?: number;
  createdAt: string;
}

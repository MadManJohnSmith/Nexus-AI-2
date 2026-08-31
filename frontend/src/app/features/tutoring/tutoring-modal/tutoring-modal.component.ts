import {
  Component,
  input,
  output,
  signal,
  effect,
  inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TutoringService } from '../../../core/services/tutoring.service';
import {
  TutoringModality,
  TutoringSession,
  TutoringSessionCreateRequest,
  TutoringRole
} from '../../../core/models/tutoring.model';

export interface ParticipantItem {
  user: number;
  userName: string;
  rol_en_sesion: TutoringRole | string;
  asistencia: boolean;
  notas: string;
}

export interface ObservationItem {
  titulo_tema: string;
  contenido: string;
}

@Component({
  selector: 'app-tutoring-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tutoring-modal.component.html',
  styleUrls: ['./tutoring-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutoringModalComponent {
  private fb = inject(FormBuilder);
  private tutoringService = inject(TutoringService);

  // Inputs
  readonly isOpen = input<boolean>(false);
  readonly studentId = input<number | undefined>(1);
  readonly semesterId = input<number | undefined>(undefined);
  readonly studentName = input<string | undefined>('María González López');
  readonly semesterNumber = input<number | undefined>(3);

  // Outputs (both close and closed supported for flexibility)
  readonly close = output<void>();
  readonly closed = output<void>();
  readonly saved = output<TutoringSession>();

  // State signals
  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  // Participants signal list
  readonly participantsList = signal<ParticipantItem[]>([
    {
      user: 1,
      userName: 'Estudiante (Doctorando)',
      rol_en_sesion: 'ESTUDIANTE',
      asistencia: true,
      notas: ''
    },
    {
      user: 2,
      userName: 'Dr. Roberto Mendoza',
      rol_en_sesion: 'ASESOR_PRINCIPAL',
      asistencia: true,
      notas: ''
    },
    {
      user: 3,
      userName: 'Dra. Carmen Silva',
      rol_en_sesion: 'COASESOR',
      asistencia: true,
      notas: ''
    }
  ]);

  // Observations dynamic signal list
  readonly observationsList = signal<ObservationItem[]>([
    {
      titulo_tema: 'Revisión Metodológica y Avance de Tesis',
      contenido: 'Revisión detallada de los resultados experimentales y validación de hipótesis.'
    }
  ]);

  // Form Group
  readonly form = this.fb.group({
    fecha_sesion: [new Date().toISOString().split('T')[0], [Validators.required]],
    semester: [3, [Validators.required, Validators.min(1), Validators.max(6)]],
    modalidad: ['PRESENCIAL' as TutoringModality, [Validators.required]],
    resumen: ['', [Validators.required, Validators.minLength(10)]],
    proxima_reunion_fecha: [''],
    proxima_reunion_notas: ['']
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const sem = this.semesterNumber() || this.semesterId() || 3;
        const currentStudentName = this.studentName() || 'Estudiante';

        this.form.patchValue({
          fecha_sesion: new Date().toISOString().split('T')[0],
          semester: sem,
          modalidad: 'PRESENCIAL',
          resumen: '',
          proxima_reunion_fecha: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          proxima_reunion_notas: ''
        });

        // Initialize default participants
        this.participantsList.set([
          {
            user: this.studentId() || 1,
            userName: `${currentStudentName} (Doctorando)`,
            rol_en_sesion: 'ESTUDIANTE',
            asistencia: true,
            notas: ''
          },
          {
            user: 2,
            userName: 'Dr. Roberto Mendoza (Director)',
            rol_en_sesion: 'ASESOR_PRINCIPAL',
            asistencia: true,
            notas: ''
          },
          {
            user: 3,
            userName: 'Dra. Carmen Silva (Coasesor)',
            rol_en_sesion: 'COASESOR',
            asistencia: true,
            notas: ''
          }
        ]);

        // Initialize default observation topic
        this.observationsList.set([
          {
            titulo_tema: 'Avance de Capítulo y Metodología',
            contenido: ''
          }
        ]);

        this.errorMessage.set(null);
        this.isSubmitting.set(false);
      }
    });
  }

  onCloseModal(): void {
    this.close.emit();
    this.closed.emit();
  }

  // Participants management
  toggleParticipantAttendance(index: number): void {
    this.participantsList.update(list => {
      const updated = [...list];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          asistencia: !updated[index].asistencia
        };
      }
      return updated;
    });
  }

  updateParticipantNotes(index: number, notes: string): void {
    this.participantsList.update(list => {
      const updated = [...list];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          notas: notes
        };
      }
      return updated;
    });
  }

  // Observations dynamic management
  addObservationTopic(): void {
    this.observationsList.update(list => [
      ...list,
      {
        titulo_tema: '',
        contenido: ''
      }
    ]);
  }

  removeObservationTopic(index: number): void {
    this.observationsList.update(list => list.filter((_, i) => i !== index));
  }

  updateObservationTopic(index: number, field: 'titulo_tema' | 'contenido', value: string): void {
    this.observationsList.update(list => {
      const updated = [...list];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          [field]: value
        };
      }
      return updated;
    });
  }

  // Submit Session
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formVal = this.form.value;
    const student = this.studentId() || 1;
    const semester = Number(formVal.semester) || 1;

    // Filter valid observations
    const validObservations = this.observationsList()
      .filter(obs => obs.titulo_tema.trim().length > 0 || obs.contenido.trim().length > 0)
      .map(obs => ({
        titulo_tema: obs.titulo_tema.trim() || 'Tema General',
        contenido: obs.contenido.trim() || 'Sin observaciones adicionales.'
      }));

    const createPayload: TutoringSessionCreateRequest = {
      student,
      semester,
      fecha_sesion: formVal.fecha_sesion || new Date().toISOString().split('T')[0],
      modalidad: (formVal.modalidad as TutoringModality) || 'PRESENCIAL',
      resumen: formVal.resumen || '',
      proxima_reunion_fecha: formVal.proxima_reunion_fecha || null,
      proxima_reunion_notas: formVal.proxima_reunion_notas || '',
      participants: this.participantsList().map(p => ({
        user: p.user,
        rol_en_sesion: p.rol_en_sesion,
        asistencia: p.asistencia,
        notas: p.notas
      })),
      observations: validObservations
    };

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.tutoringService.createSession(createPayload).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        const sessionResult = response.tutoring_session || {
          id: response.tutoring_session_created_id || Date.now(),
          student,
          student_nombre: this.studentName() || 'Estudiante',
          semester,
          semester_numero: semester,
          fecha_sesion: createPayload.fecha_sesion,
          modalidad: createPayload.modalidad,
          resumen: createPayload.resumen,
          proxima_reunion_fecha: createPayload.proxima_reunion_fecha,
          proxima_reunion_notas: createPayload.proxima_reunion_notas,
          participants: this.participantsList().map((p, idx) => ({
            id: idx + 1,
            user: p.user,
            userName: p.userName,
            rol_en_sesion: p.rol_en_sesion,
            asistencia: p.asistencia,
            notas: p.notas
          })),
          observations: validObservations.map((o, idx) => ({
            id: idx + 1,
            titulo_tema: o.titulo_tema,
            contenido: o.contenido
          })),
          total_participantes: this.participantsList().length,
          total_observaciones: validObservations.length,
          created_at: new Date().toISOString()
        };

        this.saved.emit(sessionResult);
        this.onCloseModal();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        // Fallback for demo / offline
        const fallbackSession: TutoringSession = {
          id: Date.now(),
          student,
          student_nombre: this.studentName() || 'Estudiante',
          semester,
          semester_numero: semester,
          fecha_sesion: createPayload.fecha_sesion,
          modalidad: createPayload.modalidad,
          resumen: createPayload.resumen,
          proxima_reunion_fecha: createPayload.proxima_reunion_fecha,
          proxima_reunion_notas: createPayload.proxima_reunion_notas,
          participants: this.participantsList().map((p, idx) => ({
            id: idx + 1,
            user: p.user,
            userName: p.userName,
            rol_en_sesion: p.rol_en_sesion,
            asistencia: p.asistencia,
            notas: p.notas
          })),
          observations: validObservations.map((o, idx) => ({
            id: idx + 1,
            titulo_tema: o.titulo_tema,
            contenido: o.contenido
          })),
          total_participantes: this.participantsList().length,
          total_observaciones: validObservations.length,
          created_at: new Date().toISOString()
        };
        this.saved.emit(fallbackSession);
        this.onCloseModal();
      }
    });
  }
}

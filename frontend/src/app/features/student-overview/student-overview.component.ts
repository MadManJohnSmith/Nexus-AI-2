import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { StudentService } from '../../core/services/student.service';
import { StudentDetail, Semester } from '../../core/models/student.model';
import { TutoringSession } from '../../core/models/tutoring.model';
import { Agreement } from '../../core/models/agreement.model';
import { ThesisProgress } from '../../core/models/thesis.model';
import { TimelineNode } from '../../core/models/timeline.model';
import { PillBadgeComponent } from '../../shared/components/pill-badge/pill-badge.component';
import { AcademicCommitteeComponent } from '../committee/academic-committee/academic-committee.component';
import { AgreementDrawerComponent } from '../agreements/agreement-drawer/agreement-drawer.component';
import { TutoringModalComponent } from '../tutoring/tutoring-modal/tutoring-modal.component';

@Component({
  selector: 'app-student-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PillBadgeComponent,
    AcademicCommitteeComponent,
    AgreementDrawerComponent,
    TutoringModalComponent
  ],
  templateUrl: './student-overview.component.html',
  styleUrls: ['./student-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentOverviewComponent implements OnInit {
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);

  // Optional route param binding via input or ActivatedRoute
  readonly id = input<string>();

  // State Signals
  readonly student = signal<StudentDetail | null>(null);
  readonly semesters = signal<Semester[]>([]);
  readonly activeSemester = signal<number | 'ALL'>(3);
  readonly tutoringSessions = signal<TutoringSession[]>([]);
  readonly agreements = signal<Agreement[]>([]);
  readonly thesisProgress = signal<ThesisProgress | null>(null);
  readonly timelineNodes = signal<TimelineNode[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly activeTab = signal<'RESUMEN' | 'TIMELINE' | 'ACUERDOS' | 'TUTORIAS'>('RESUMEN');

  // Modal & Drawer Control Signals
  readonly isDrawerOpen = signal<boolean>(false);
  readonly drawerMode = signal<'CREATE' | 'STATUS_UPDATE'>('CREATE');
  readonly selectedAgreement = signal<Agreement | null>(null);
  readonly isTutoringModalOpen = signal<boolean>(false);

  // Computed views based on active semester
  readonly currentSemesterData = computed(() => {
    const semNumber = this.activeSemester();
    if (semNumber === 'ALL') return null;
    return this.semesters().find(s => s.number === semNumber) || null;
  });

  readonly filteredAgreements = computed(() => {
    const sem = this.activeSemester();
    const list = this.agreements();
    if (sem === 'ALL') return list;
    return list.filter(a => a.semesterNumber === sem);
  });

  readonly filteredTutoringSessions = computed(() => {
    const sem = this.activeSemester();
    const list = this.tutoringSessions();
    if (sem === 'ALL') return list;
    return list.filter(t => t.semesterNumber === sem);
  });

  readonly filteredTimelineNodes = computed(() => {
    const sem = this.activeSemester();
    const list = this.timelineNodes();
    if (sem === 'ALL') return list;
    return list.filter(node => node.semesterNumber === sem);
  });

  // Summary counts for filtered active semester
  readonly pendingAgreementsCount = computed(() => {
    return this.filteredAgreements().filter(a => a.status === 'PENDIENTE').length;
  });

  readonly inProgressAgreementsCount = computed(() => {
    return this.filteredAgreements().filter(a => a.status === 'EN_PROCESO').length;
  });

  readonly overdueAgreementsCount = computed(() => {
    return this.filteredAgreements().filter(a => a.status === 'VENCIDO').length;
  });

  readonly concludedAgreementsCount = computed(() => {
    return this.filteredAgreements().filter(a => a.status === 'CONCLUIDO').length;
  });

  // Total overdue count for global student trajectory
  readonly totalOverdueAgreementsCount = computed(() => {
    return this.agreements().filter(a => a.status === 'VENCIDO').length;
  });

  ngOnInit(): void {
    const studentId = this.id() || this.route.snapshot.paramMap.get('id') || '1';
    this.loadStudentOverview(studentId);
  }

  loadStudentOverview(studentId: string): void {
    this.isLoading.set(true);

    this.studentService.getStudentDetail(studentId).subscribe(detail => {
      this.student.set(detail);
      this.semesters.set(detail.semesters || []);
      if (detail.currentSemester) {
        this.activeSemester.set(detail.currentSemester);
      }

      // Load related collections
      this.studentService.getTutoringSessions(studentId).subscribe(sessions => {
        this.tutoringSessions.set(sessions);
      });

      this.studentService.getAgreements(studentId).subscribe(agreements => {
        // Enriched sample agreements if empty for realistic simulation
        if (!agreements || agreements.length === 0) {
          const enrichedAgreements: Agreement[] = [
            {
              id: 1,
              studentId: Number(studentId),
              studentName: detail.nombre_completo || detail.user?.fullName,
              studentMatricula: detail.matricula,
              tutoringSessionId: 101,
              tutoringSessionTitle: 'Sesión Ordinaria - Revisión Capítulo 3',
              semesterNumber: 3,
              title: 'Completar benchmark comparativo de modelos BERT y RoBERTa',
              description: 'Ejecutar las pruebas experimentales con los corpus de validación y tabular métricas F1 y precisión.',
              responsibleId: 101,
              responsibleName: detail.nombre_completo || 'María González López',
              responsibleRole: 'Doctorando',
              dueDate: '2024-12-15',
              status: 'PENDIENTE',
              isOverdue: false,
              createdAt: '2024-11-20T10:30:00Z',
              updatedAt: '2024-11-20T10:30:00Z'
            },
            {
              id: 2,
              studentId: Number(studentId),
              studentName: detail.nombre_completo || detail.user?.fullName,
              studentMatricula: detail.matricula,
              tutoringSessionId: 101,
              tutoringSessionTitle: 'Sesión Ordinaria - Revisión Capítulo 3',
              semesterNumber: 3,
              title: 'Revisión y retroalimentación del borrador del Capítulo 3',
              description: 'El comité asesor revisará la sección de metodología experimental y emitirá sugerencias de ajuste.',
              responsibleId: 2,
              responsibleName: 'Dr. Roberto Mendoza',
              responsibleRole: 'Asesor Principal',
              dueDate: '2024-12-20',
              status: 'EN_PROCESO',
              isOverdue: false,
              createdAt: '2024-11-20T10:30:00Z',
              updatedAt: '2024-11-25T14:00:00Z'
            },
            {
              id: 3,
              studentId: Number(studentId),
              studentName: detail.nombre_completo || detail.user?.fullName,
              studentMatricula: detail.matricula,
              tutoringSessionId: 98,
              tutoringSessionTitle: 'Revisión Extraordinaria de Protocolo',
              semesterNumber: 3,
              title: 'Entrega de constancia de seminario de investigación I',
              description: 'Cargar el comprobante de asistencia y ponencia aprobada en el seminario departamental.',
              responsibleId: 101,
              responsibleName: detail.nombre_completo || 'María González López',
              responsibleRole: 'Doctorando',
              dueDate: '2024-10-30',
              status: 'VENCIDO',
              isOverdue: true,
              createdAt: '2024-10-01T09:00:00Z',
              updatedAt: '2024-11-01T08:00:00Z'
            },
            {
              id: 4,
              studentId: Number(studentId),
              studentName: detail.nombre_completo || detail.user?.fullName,
              studentMatricula: detail.matricula,
              tutoringSessionId: 85,
              tutoringSessionTitle: 'Coloquio Semestral de Avances',
              semesterNumber: 2,
              title: 'Envío de artículo científico a revista Q2 IEEE',
              description: 'Finalizar formato de doble columna y anexar cartas de coautores para someter al journal.',
              responsibleId: 101,
              responsibleName: detail.nombre_completo || 'María González López',
              responsibleRole: 'Doctorando',
              dueDate: '2024-05-15',
              status: 'CONCLUIDO',
              completionDate: '2024-05-12',
              resolutionNotes: 'Artículo sometido exitosamente con folio IEEE-NLP-2024-889.',
              isOverdue: false,
              createdAt: '2024-04-10T11:00:00Z',
              updatedAt: '2024-05-12T16:30:00Z'
            }
          ];
          this.agreements.set(enrichedAgreements);
        } else {
          this.agreements.set(agreements);
        }
      });

      this.studentService.getThesisProgress(studentId).subscribe(progress => {
        this.thesisProgress.set(progress);
      });

      this.studentService.getStudentTimeline(studentId).subscribe(nodes => {
        this.timelineNodes.set(nodes);
        this.isLoading.set(false);
      });
    });
  }

  selectSemester(semesterNumber: number | 'ALL'): void {
    this.activeSemester.set(semesterNumber);
  }

  setActiveTab(tab: 'RESUMEN' | 'TIMELINE' | 'ACUERDOS' | 'TUTORIAS'): void {
    this.activeTab.set(tab);
  }

  // Drawer Actions
  openCreateAgreementDrawer(): void {
    this.drawerMode.set('CREATE');
    this.selectedAgreement.set(null);
    this.isDrawerOpen.set(true);
  }

  openUpdateAgreementDrawer(agreement: Agreement): void {
    this.drawerMode.set('STATUS_UPDATE');
    this.selectedAgreement.set(agreement);
    this.isDrawerOpen.set(true);
  }

  closeAgreementDrawer(): void {
    this.isDrawerOpen.set(false);
    this.selectedAgreement.set(null);
  }

  onAgreementSaved(savedAgr: Agreement): void {
    const studentId = String(savedAgr.studentId || this.student()?.id || '1');
    if (this.drawerMode() === 'CREATE') {
      this.agreements.update(list => [savedAgr, ...list]);
    } else {
      this.agreements.update(list => list.map(a => a.id === savedAgr.id ? savedAgr : a));
    }
    // Refresh timeline after agreement updates
    this.studentService.getStudentTimeline(studentId).subscribe(nodes => {
      if (nodes && nodes.length > 0) {
        this.timelineNodes.set(nodes);
      }
    });
  }

  // Tutoring Modal Actions
  openTutoringModal(): void {
    this.isTutoringModalOpen.set(true);
  }

  closeTutoringModal(): void {
    this.isTutoringModalOpen.set(false);
  }

  onTutoringSessionSaved(session: TutoringSession): void {
    const studentId = String(session.student || this.student()?.id || '1');
    
    // Add new session immediately to local reactive signal
    this.tutoringSessions.update(list => [session, ...list.filter(s => s.id !== session.id)]);
    
    // Refresh tutoring sessions from backend
    this.studentService.getTutoringSessions(studentId).subscribe(sessions => {
      if (sessions && sessions.length > 0) {
        this.tutoringSessions.set(sessions);
      }
    });

    // Refresh agreements reactively
    this.studentService.getAgreements(studentId).subscribe(agreements => {
      if (agreements && agreements.length > 0) {
        this.agreements.set(agreements);
      }
    });

    // Refresh longitudinal timeline nodes reactively
    this.studentService.getStudentTimeline(studentId).subscribe(nodes => {
      if (nodes && nodes.length > 0) {
        this.timelineNodes.set(nodes);
      } else {
        const semNum = session.semester_numero ?? session.semesterNumero ?? (typeof session.semester === 'number' ? session.semester : 1);
        const newTimelineNode: TimelineNode = {
          id: session.id || Date.now(),
          type: 'TUTORIA',
          title: `Sesión de Tutoría (${session.modalidad || 'PRESENCIAL'})`,
          subtitle: `Semestre ${semNum}`,
          description: session.resumen || 'Sesión de tutoría registrada con acuerdos y observaciones.',
          date: session.fecha_sesion || new Date().toISOString().split('T')[0],
          semesterNumber: semNum,
          authorName: session.created_by_nombre || session.createdByNombre || 'Comité Tutorial',
          authorRole: 'Comité Tutorial',
          status: 'CONCLUIDO',
          badgeText: session.modalidad || 'PRESENCIAL',
          badgeType: 'CONCLUIDO'
        };
        this.timelineNodes.update(currentNodes => [newTimelineNode, ...currentNodes]);
      }
    });
  }

  getNodeIcon(type: string): string {
    switch (type) {
      case 'TUTORIA': return '📘';
      case 'ACUERDO': return '📝';
      case 'TESIS': return '📊';
      case 'EVIDENCIA': return '📎';
      case 'PRODUCCION': return '🎓';
      default: return '📌';
    }
  }
}

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

@Component({
  selector: 'app-student-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, PillBadgeComponent, AcademicCommitteeComponent],
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

  // Summary counts
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
        this.agreements.set(agreements);
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

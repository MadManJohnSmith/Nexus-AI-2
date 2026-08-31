import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../core/services/student.service';
import { Student } from '../../core/models/student.model';
import { PillBadgeComponent } from '../../shared/components/pill-badge/pill-badge.component';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PillBadgeComponent],
  template: `
    <div class="students-page">
      <div class="page-header">
        <div>
          <h2>Padrón de Estudiantes de Doctorado</h2>
          <p class="subtitle">Directorio oficial de alumnos matriculados y seguimiento curricular</p>
        </div>
        <button type="button" class="btn-nexus-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Registrar Estudiante
        </button>
      </div>

      <div class="nexus-card">
        <div class="table-responsive">
          <table class="nexus-table">
            <thead>
              <tr>
                <th>Estudiante / Matrícula</th>
                <th>Programa</th>
                <th>Cohorte</th>
                <th>Semestre Actual</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (st of students(); track st.id) {
                <tr>
                  <td>
                    <div class="student-cell">
                      <div class="student-avatar">{{ st.user.firstName.charAt(0) }}{{ st.user.lastName.charAt(0) }}</div>
                      <div>
                        <strong>{{ st.user.fullName }}</strong>
                        <span class="sub-matricula">{{ st.matricula }}</span>
                      </div>
                    </div>
                  </td>
                  <td>{{ st.program }}</td>
                  <td>{{ st.cohort }}</td>
                  <td>
                    <span class="semester-pill">{{ st.currentSemester }}° Semestre</span>
                  </td>
                  <td>
                    <app-pill-badge [type]="st.status === 'ACTIVO' ? 'ACTIVO' : 'INFO'" size="sm">
                      {{ st.status }}
                    </app-pill-badge>
                  </td>
                  <td>
                    <a [routerLink]="['/students', st.id]" class="btn-nexus-outline btn-sm">
                      Ver Expediente
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .students-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .page-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--nexus-emphasis);
    }
    .subtitle {
      font-size: 0.875rem;
      color: var(--nexus-text-muted);
    }
    .nexus-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .nexus-table th {
      padding: 12px 16px;
      background-color: var(--nexus-bg-app);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--nexus-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--nexus-border);
    }
    .nexus-table td {
      padding: 16px;
      font-size: 0.875rem;
      color: var(--nexus-text-secondary);
      border-bottom: 1px solid var(--nexus-border-light);
      vertical-align: middle;
    }
    .student-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .student-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #6365EF;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.8125rem;
    }
    .sub-matricula {
      display: block;
      font-size: 0.75rem;
      color: var(--nexus-text-muted);
      font-family: monospace;
    }
    .semester-pill {
      background-color: #EEEEFF;
      color: #6365EF;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
    }
    .btn-sm {
      padding: 6px 12px;
      font-size: 0.8125rem;
    }
  `]
})
export class StudentsListComponent implements OnInit {
  private studentService = inject(StudentService);
  readonly students = signal<Student[]>([]);

  ngOnInit(): void {
    this.studentService.getStudents().subscribe(list => {
      this.students.set(list);
    });
  }
}

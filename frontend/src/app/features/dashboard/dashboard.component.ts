import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MonitoringService } from '../../core/services/monitoring.service';
import {
  DashboardKPIs,
  RiskSemaphore,
  PrioritizedStudent,
  CohortDistribution,
  RiskLevel
} from '../../core/models/dashboard.model';
import { PillBadgeComponent } from '../../shared/components/pill-badge/pill-badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PillBadgeComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private monitoringService = inject(MonitoringService);
  private router = inject(Router);

  // Reactive State Signals
  readonly kpis = signal<DashboardKPIs | null>(null);
  readonly riskSemaphore = signal<RiskSemaphore | null>(null);
  readonly prioritizedStudents = signal<PrioritizedStudent[]>([]);
  readonly cohortDistribution = signal<CohortDistribution[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // Filters Signals
  readonly riskFilter = signal<RiskLevel | 'TODOS'>('TODOS');
  readonly cohortFilter = signal<string>('TODAS');
  readonly searchTerm = signal<string>('');

  // Available unique cohorts
  readonly availableCohorts = computed(() => {
    const list = this.cohortDistribution();
    return list.map(c => c.cohorte);
  });

  // Filtered Students Computed Signal
  readonly filteredStudents = computed(() => {
    let result = this.prioritizedStudents();
    const risk = this.riskFilter();
    const cohort = this.cohortFilter();
    const search = this.searchTerm().trim().toLowerCase();

    if (risk !== 'TODOS') {
      result = result.filter(st => st.nivel_riesgo === risk);
    }

    if (cohort !== 'TODAS') {
      result = result.filter(st => st.cohorte === cohort);
    }

    if (search) {
      result = result.filter(st =>
        st.nombre.toLowerCase().includes(search) ||
        st.matricula.toLowerCase().includes(search) ||
        st.asesor_principal.toLowerCase().includes(search)
      );
    }

    return result;
  });

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set(null);

    this.monitoringService.getCoordinatorDashboard().subscribe({
      next: (data) => {
        this.kpis.set(data.kpis);
        this.riskSemaphore.set(data.semaforo_riesgo);
        this.prioritizedStudents.set(data.tabla_priorizada || []);
        this.cohortDistribution.set(data.distribucion_cohorte || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar los datos del dashboard institucional');
        this.loading.set(false);
      }
    });
  }

  setRiskFilter(filter: RiskLevel | 'TODOS'): void {
    this.riskFilter.set(filter);
  }

  setCohortFilter(cohort: string): void {
    this.cohortFilter.set(cohort);
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  clearFilters(): void {
    this.riskFilter.set('TODOS');
    this.cohortFilter.set('TODAS');
    this.searchTerm.set('');
  }

  navigateToStudent(studentId: number): void {
    this.router.navigate(['/students', studentId]);
  }

  getRiskBadgeType(nivel: RiskLevel): 'VENCIDO' | 'EN_PROCESO' | 'CONCLUIDO' {
    switch (nivel) {
      case 'CRITICO':
        return 'VENCIDO';
      case 'PREVENTIVO':
        return 'EN_PROCESO';
      case 'AL_DIA':
        return 'CONCLUIDO';
      default:
        return 'CONCLUIDO';
    }
  }

  getRiskLabel(nivel: RiskLevel): string {
    switch (nivel) {
      case 'CRITICO':
        return 'Atención Crítica';
      case 'PREVENTIVO':
        return 'Preventiva';
      case 'AL_DIA':
        return 'Al Día';
      default:
        return nivel;
    }
  }
}

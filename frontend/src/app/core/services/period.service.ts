import { Injectable, signal } from '@angular/core';

export interface AcademicPeriod {
  id: string;
  label: string;
  isCurrent: boolean;
}

const STORAGE_KEY = 'nexus_active_period';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  readonly periods = signal<AcademicPeriod[]>([
    { id: 'TODOS', label: 'Todos los Ciclos', isCurrent: false },
    { id: '2026-A', label: '2026-A (Actual)', isCurrent: true },
    { id: '2025-B', label: '2025-B', isCurrent: false },
    { id: '2025-A', label: '2025-A', isCurrent: false },
    { id: '2024-B', label: '2024-B', isCurrent: false },
    { id: '2024-A', label: '2024-A', isCurrent: false },
    { id: '2023-B', label: '2023-B', isCurrent: false }
  ]);

  readonly activePeriod = signal<string>(this.getInitialPeriod());

  private getInitialPeriod(): string {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // Ignore localStorage errors in SSR or restricted environments
    }
    return 'TODOS';
  }

  setPeriod(periodId: string): void {
    this.activePeriod.set(periodId);
    try {
      localStorage.setItem(STORAGE_KEY, periodId);
    } catch {
      // Ignore localStorage write errors
    }
  }
}

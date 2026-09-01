import { Injectable, signal } from '@angular/core';

export interface AcademicPeriod {
  id: string;
  label: string;
  isCurrent: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  readonly periods = signal<AcademicPeriod[]>([
    { id: '2026-A', label: '2026-A (Actual)', isCurrent: true },
    { id: '2025-B', label: '2025-B', isCurrent: false },
    { id: '2025-A', label: '2025-A', isCurrent: false },
    { id: '2024-B', label: '2024-B', isCurrent: false },
    { id: '2024-A', label: '2024-A', isCurrent: false },
    { id: '2023-B', label: '2023-B', isCurrent: false }
  ]);

  readonly activePeriod = signal<string>('2026-A');

  setPeriod(periodId: string): void {
    this.activePeriod.set(periodId);
  }
}

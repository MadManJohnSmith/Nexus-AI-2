import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AlertsResponse, AlertItem, TimelineResponse } from '../models/timeline.model';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v2/monitoring';

  // Reactive State Signals
  readonly alerts = signal<AlertItem[]>([]);
  readonly totalAlertas = signal<number>(0);
  readonly loadingAlerts = signal<boolean>(false);
  readonly errorAlerts = signal<string | null>(null);

  /**
   * Obtiene la lista reactiva de alertas del sistema (acuerdos vencidos, por vencer, falta de tutoría).
   */
  getAlerts(studentId?: number): Observable<AlertsResponse> {
    this.loadingAlerts.set(true);
    this.errorAlerts.set(null);

    let params = new HttpParams();
    if (studentId) {
      params = params.set('student', studentId.toString());
    }

    return this.http.get<AlertsResponse>(`${this.apiUrl}/alerts/`, { params }).pipe(
      tap({
        next: (res) => {
          this.alerts.set(res.alertas || []);
          this.totalAlertas.set(res.total_alertas || 0);
          this.loadingAlerts.set(false);
        },
        error: (err) => {
          this.errorAlerts.set(err.message || 'Error al cargar alertas');
          this.loadingAlerts.set(false);
        }
      })
    );
  }

  /**
   * Refresca las alertas del sistema actualizando los Signals.
   */
  refreshAlerts(studentId?: number): void {
    this.getAlerts(studentId).subscribe({
      error: () => {}
    });
  }

  /**
   * Obtiene la trayectoria longitudinal completa de un estudiante unificando tutorías,
   * acuerdos, tesis y evidencias.
   */
  getTimeline(studentId: number): Observable<TimelineResponse> {
    const params = new HttpParams().set('student', studentId.toString());
    return this.http.get<TimelineResponse>(`${this.apiUrl}/timeline/`, { params });
  }
}

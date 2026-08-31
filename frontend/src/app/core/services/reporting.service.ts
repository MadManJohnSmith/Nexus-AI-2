import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { FullDossier } from '../models/dossier.model';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v2/reporting';

  readonly dossier = signal<FullDossier | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  getFullDossier(studentId: number): Observable<FullDossier> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<FullDossier>(`${this.baseUrl}/students/${studentId}/full-dossier/`).pipe(
      tap(data => {
        this.dossier.set(data);
        this.loading.set(false);
      }),
      catchError(err => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al obtener la cédula del expediente.');
        throw err;
      })
    );
  }
}

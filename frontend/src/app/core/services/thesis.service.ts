import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import {
  ThesisProgress,
  ThesisProgressCreateRequest,
  ThesisProgressCreateResponse
} from '../models/thesis.model';

@Injectable({
  providedIn: 'root'
})
export class ThesisService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v2/thesis';

  readonly progressList = signal<ThesisProgress[]>([]);
  readonly latestProgress = signal<ThesisProgress | null>(null);
  readonly loading = signal<boolean>(false);

  private normalizeThesisProgress(raw: any): ThesisProgress {
    const defaultComponents = {
      protocolo: 0,
      estadoArte: 0,
      marcoTeorico: 0,
      metodologia: 0,
      analisis: 0,
      redaccion: 0
    };

    return {
      id: raw.id,
      student: raw.student || raw.studentId || 0,
      student_nombre: raw.student_nombre || raw.studentName || '',
      student_matricula: raw.student_matricula || raw.studentMatricula || '',
      semester: raw.semester || raw.semesterId || 0,
      semester_numero: raw.semester_numero ?? raw.semesterNumero ?? 1,
      porcentaje_avance: raw.porcentaje_avance ?? raw.currentPercentage ?? raw.percentage ?? 0,
      componentes_json: raw.componentes_json || raw.components || defaultComponents,
      observaciones: raw.observaciones || raw.summary || raw.observations || '',
      fecha_registro: raw.fecha_registro || raw.registrationDate || new Date().toISOString().split('T')[0],
      created_at: raw.created_at || raw.createdAt || new Date().toISOString(),
      updated_at: raw.updated_at || raw.updatedAt || new Date().toISOString(),

      // Aliases
      studentId: raw.student || raw.studentId,
      studentName: raw.student_nombre || raw.studentName,
      studentMatricula: raw.student_matricula || raw.studentMatricula,
      semesterId: raw.semester || raw.semesterId,
      semesterNumero: raw.semester_numero ?? raw.semesterNumero,
      currentPercentage: raw.porcentaje_avance ?? raw.currentPercentage ?? raw.percentage ?? 0,
      percentage: raw.porcentaje_avance ?? raw.currentPercentage ?? raw.percentage ?? 0,
      components: raw.componentes_json || raw.components || defaultComponents,
      summary: raw.observaciones || raw.summary || raw.observations || '',
      observations: raw.observaciones || raw.summary || raw.observations || '',
      registrationDate: raw.fecha_registro || raw.registrationDate
    };
  }

  getThesisProgresses(params?: {
    student?: number | string;
    studentId?: number | string;
    semester?: number | string;
  }): Observable<ThesisProgress[]> {
    this.loading.set(true);
    let httpParams = new HttpParams();

    if (params) {
      const studentVal = params.student || params.studentId;
      if (studentVal) {
        httpParams = httpParams.set('student', studentVal.toString());
      }
      if (params.semester) {
        httpParams = httpParams.set('semester', params.semester.toString());
      }
    }

    return this.http.get<any>(`${this.baseUrl}/`, { params: httpParams }).pipe(
      map(response => {
        const rawList = Array.isArray(response)
          ? response
          : (response.results || []);
        return rawList.map((item: any) => this.normalizeThesisProgress(item));
      }),
      tap(items => {
        this.progressList.set(items);
        this.latestProgress.set(items.length > 0 ? items[0] : null);
        this.loading.set(false);
      }),
      catchError(err => {
        console.error('Error fetching thesis progress:', err);
        this.loading.set(false);
        return of([]);
      })
    );
  }

  getThesisProgressById(id: number): Observable<ThesisProgress | null> {
    return this.http.get<any>(`${this.baseUrl}/${id}/`).pipe(
      map(raw => this.normalizeThesisProgress(raw)),
      catchError(err => {
        console.error(`Error fetching thesis progress ${id}:`, err);
        return of(null);
      })
    );
  }

  createThesisProgress(data: ThesisProgressCreateRequest): Observable<ThesisProgressCreateResponse> {
    return this.http.post<ThesisProgressCreateResponse>(`${this.baseUrl}/`, data).pipe(
      tap(res => {
        if (res && res.thesis_progress) {
          const normalized = this.normalizeThesisProgress(res.thesis_progress);
          this.progressList.update(list => [normalized, ...list]);
          this.latestProgress.set(normalized);
        }
      })
    );
  }

  deleteThesisProgress(id: number): Observable<boolean> {
    return this.http.delete<{ details: string; success: boolean }>(`${this.baseUrl}/${id}/`).pipe(
      map(res => res.success ?? true),
      tap(success => {
        if (success) {
          this.progressList.update(list => list.filter(item => item.id !== id));
        }
      }),
      catchError(err => {
        console.error(`Error deleting thesis progress ${id}:`, err);
        return of(false);
      })
    );
  }
}

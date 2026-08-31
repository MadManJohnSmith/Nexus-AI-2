import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import {
  Evidence,
  EvidenceCreateResponse,
  EvidenceFilterParams,
  EvidenceType,
  EvidenceActivityType
} from '../models/evidence.model';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v2/evidence';

  readonly evidences = signal<Evidence[]>([]);
  readonly loading = signal<boolean>(false);

  private normalizeEvidence(raw: any): Evidence {
    return {
      id: raw.id,
      student: raw.student || raw.studentId || 0,
      student_nombre: raw.student_nombre || raw.studentName || '',
      student_matricula: raw.student_matricula || raw.studentMatricula || '',
      semester: raw.semester || raw.semesterId || null,
      semester_numero: raw.semester_numero ?? raw.semesterNumber ?? null,
      tipo: raw.tipo || raw.type || 'ARCHIVO_LOCAL',
      tipo_display: raw.tipo_display || (raw.tipo === 'ENLACE_DOI' ? 'Enlace DOI/URL' : 'Archivo Local'),
      actividad_tipo: raw.actividad_tipo || raw.activityType || 'OTRO',
      actividad_tipo_display: raw.actividad_tipo_display || raw.actividad_tipo || 'Otro',
      actividad_id: raw.actividad_id || raw.activityId || null,
      titulo: raw.titulo || raw.title || '',
      descripcion: raw.descripcion || raw.description || '',
      archivo_adjunto: raw.archivo_adjunto,
      archivo_url: raw.archivo_url || raw.fileUrl || (raw.archivo_adjunto ? raw.archivo_adjunto : null),
      enlace_url: raw.enlace_url || raw.url || raw.doiUrl || '',
      mime_type: raw.mime_type || raw.mimeType || '',
      file_size_bytes: raw.file_size_bytes || raw.fileSizeBytes || raw.size || 0,
      fecha_carga: raw.fecha_carga || raw.uploadDate || new Date().toISOString().split('T')[0],
      created_by: raw.created_by,
      created_by_nombre: raw.created_by_nombre,
      created_at: raw.created_at || raw.createdAt || new Date().toISOString(),

      // Aliases
      studentId: raw.student || raw.studentId,
      studentName: raw.student_nombre || raw.studentName,
      studentMatricula: raw.student_matricula || raw.studentMatricula,
      semesterId: raw.semester || raw.semesterId,
      semesterNumber: raw.semester_numero ?? raw.semesterNumber,
      type: raw.tipo || raw.type || 'ARCHIVO_LOCAL',
      activityType: raw.actividad_tipo || raw.activityType || 'OTRO',
      activityId: raw.actividad_id || raw.activityId,
      title: raw.titulo || raw.title,
      description: raw.descripcion || raw.description,
      fileUrl: raw.archivo_url || raw.fileUrl,
      url: raw.enlace_url || raw.url,
      doiUrl: raw.enlace_url || raw.doiUrl,
      mimeType: raw.mime_type || raw.mimeType,
      fileSizeBytes: raw.file_size_bytes || raw.fileSizeBytes,
      size: raw.file_size_bytes || raw.size,
      uploadDate: raw.fecha_carga || raw.uploadDate,
      createdAt: raw.created_at || raw.createdAt
    };
  }

  getEvidences(params?: EvidenceFilterParams): Observable<Evidence[]> {
    this.loading.set(true);
    let httpParams = new HttpParams();

    if (params) {
      const studentVal = params.student || params.studentId;
      if (studentVal) {
        httpParams = httpParams.set('student', studentVal.toString());
      }
      if (params.actividad_tipo) {
        httpParams = httpParams.set('actividad_tipo', params.actividad_tipo);
      }
      if (params.actividad_id) {
        httpParams = httpParams.set('actividad_id', params.actividad_id.toString());
      }
      if (params.tipo) {
        httpParams = httpParams.set('tipo', params.tipo);
      }
      if (params.semester) {
        httpParams = httpParams.set('semester', params.semester.toString());
      }
      if (params.search) {
        httpParams = httpParams.set('search', params.search);
      }
    }

    return this.http.get<any>(`${this.baseUrl}/`, { params: httpParams }).pipe(
      map(response => {
        const rawList = Array.isArray(response)
          ? response
          : (response.results || []);
        return rawList.map((item: any) => this.normalizeEvidence(item));
      }),
      tap(items => {
        this.evidences.set(items);
        this.loading.set(false);
      }),
      catchError(err => {
        console.error('Error fetching evidences:', err);
        this.loading.set(false);
        return of([]);
      })
    );
  }

  uploadFileEvidence(data: {
    student: number;
    semester?: number | null;
    actividad_tipo?: EvidenceActivityType;
    actividad_id?: number | null;
    titulo: string;
    descripcion?: string;
    archivo: File;
  }): Observable<EvidenceCreateResponse> {
    const formData = new FormData();
    formData.append('student', String(data.student));
    if (data.semester) formData.append('semester', String(data.semester));
    formData.append('tipo', 'ARCHIVO_LOCAL');
    formData.append('actividad_tipo', data.actividad_tipo || 'OTRO');
    if (data.actividad_id) formData.append('actividad_id', String(data.actividad_id));
    formData.append('titulo', data.titulo);
    if (data.descripcion) formData.append('descripcion', data.descripcion);
    formData.append('archivo_adjunto', data.archivo);

    return this.http.post<EvidenceCreateResponse>(`${this.baseUrl}/`, formData).pipe(
      tap(res => {
        if (res && res.evidence) {
          const normalized = this.normalizeEvidence(res.evidence);
          this.evidences.update(list => [normalized, ...list]);
        }
      })
    );
  }

  registerDoiEvidence(data: {
    student: number;
    semester?: number | null;
    actividad_tipo?: EvidenceActivityType;
    actividad_id?: number | null;
    titulo: string;
    descripcion?: string;
    enlace_url: string;
  }): Observable<EvidenceCreateResponse> {
    const payload = {
      student: data.student,
      semester: data.semester || null,
      tipo: 'ENLACE_DOI',
      actividad_tipo: data.actividad_tipo || 'OTRO',
      actividad_id: data.actividad_id || null,
      titulo: data.titulo,
      descripcion: data.descripcion || '',
      enlace_url: data.enlace_url
    };

    return this.http.post<EvidenceCreateResponse>(`${this.baseUrl}/`, payload).pipe(
      tap(res => {
        if (res && res.evidence) {
          const normalized = this.normalizeEvidence(res.evidence);
          this.evidences.update(list => [normalized, ...list]);
        }
      })
    );
  }

  deleteEvidence(id: number): Observable<boolean> {
    return this.http.delete<{ details: string; success: boolean }>(`${this.baseUrl}/${id}/`).pipe(
      map(res => res.success ?? true),
      tap(success => {
        if (success) {
          this.evidences.update(list => list.filter(item => item.id !== id));
        }
      }),
      catchError(err => {
        console.error(`Error deleting evidence ${id}:`, err);
        return of(false);
      })
    );
  }
}

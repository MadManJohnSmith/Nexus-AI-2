import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import {
  Agreement,
  AgreementStatus,
  AgreementCreateRequest,
  AgreementStatusUpdateRequest,
  AgreementAuditLog,
  AgreementFilterParams
} from '../models/agreement.model';
import { PaginatedResponse } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class AgreementService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v2/agreements';

  // Signals reactivos
  readonly agreements = signal<Agreement[]>([]);
  readonly selectedAgreement = signal<Agreement | null>(null);
  readonly loading = signal<boolean>(false);
  readonly totalCount = signal<number>(0);

  /**
   * Normaliza una entidad Agreement para asegurar compatibilidad bidireccional
   * con nombres snake_case y camelCase.
   */
  private normalizeAgreement(agr: any): Agreement {
    const raw = { ...agr };
    const normalized: Agreement = {
      id: raw.id,
      student: raw.student || raw.studentId || 0,
      student_nombre: raw.student_nombre || raw.studentName || '',
      student_matricula: raw.student_matricula || raw.studentMatricula || '',
      session: raw.session !== undefined ? raw.session : raw.tutoringSessionId,
      descripcion: raw.descripcion || raw.description || raw.title || '',
      responsable: raw.responsable || raw.responsibleId || 0,
      responsable_nombre: raw.responsable_nombre || raw.responsibleName || '',
      responsable_email: raw.responsable_email || '',
      fecha_limite: raw.fecha_limite || raw.dueDate || '',
      estado: (raw.estado || raw.status || 'PENDIENTE') as AgreementStatus,
      estado_display: raw.estado_display || '',
      fecha_conclusion: raw.fecha_conclusion !== undefined ? raw.fecha_conclusion : raw.completionDate,
      created_by: raw.created_by,
      created_by_nombre: raw.created_by_nombre,
      created_at: raw.created_at || raw.createdAt || new Date().toISOString(),
      updated_at: raw.updated_at || raw.updatedAt || new Date().toISOString(),
      is_vencido: raw.is_vencido !== undefined ? raw.is_vencido : raw.isOverdue,
      audit_logs: raw.audit_logs || [],

      // Aliases UI
      studentId: raw.student || raw.studentId,
      studentName: raw.student_nombre || raw.studentName,
      studentMatricula: raw.student_matricula || raw.studentMatricula,
      tutoringSessionId: raw.session || raw.tutoringSessionId,
      description: raw.descripcion || raw.description,
      responsibleId: raw.responsable || raw.responsibleId,
      responsibleName: raw.responsable_nombre || raw.responsibleName,
      dueDate: raw.fecha_limite || raw.dueDate,
      status: (raw.estado || raw.status || 'PENDIENTE') as AgreementStatus,
      completionDate: raw.fecha_conclusion || raw.completionDate,
      isOverdue: raw.is_vencido !== undefined ? raw.is_vencido : raw.isOverdue,
      createdAt: raw.created_at || raw.createdAt,
      updatedAt: raw.updated_at || raw.updatedAt
    };
    return normalized;
  }

  getAgreements(params?: AgreementFilterParams | {
    studentId?: number | string;
    status?: AgreementStatus;
    semester?: number;
    search?: string;
  }): Observable<Agreement[]> {
    this.loading.set(true);
    let httpParams = new HttpParams();

    if (params) {
      const p = params as any;
      const studentVal = p.student || p.studentId || p.student_id;
      if (studentVal) {
        httpParams = httpParams.set('student', studentVal.toString());
      }
      const estadoVal = p.estado || p.status;
      if (estadoVal && estadoVal !== 'TODOS') {
        httpParams = httpParams.set('estado', estadoVal.toString());
      }
      const respVal = p.responsable || p.responsable_id;
      if (respVal) {
        httpParams = httpParams.set('responsable', respVal.toString());
      }
      const sessVal = p.session || p.session_id || p.tutoringSessionId;
      if (sessVal) {
        httpParams = httpParams.set('session', sessVal.toString());
      }
      if (p.search) {
        httpParams = httpParams.set('search', p.search);
      }
    }

    return this.http.get<PaginatedResponse<any> | any[]>(`${this.baseUrl}/`, { params: httpParams }).pipe(
      map(res => {
        let rawList: any[] = [];
        if (Array.isArray(res)) {
          rawList = res;
        } else if (res && res.results) {
          rawList = res.results;
        }
        return rawList.map(item => this.normalizeAgreement(item));
      }),
      tap(list => {
        this.agreements.set(list);
        this.totalCount.set(list.length);
        this.loading.set(false);
      }),
      catchError(() => {
        this.agreements.set([]);
        this.totalCount.set(0);
        this.loading.set(false);
        return of([]);
      })
    );
  }

  getAgreementDetail(id: number | string): Observable<Agreement> {
    return this.getAgreementById(id);
  }

  getAgreementById(id: number | string): Observable<Agreement> {
    this.loading.set(true);
    return this.http.get<any>(`${this.baseUrl}/${id}/`).pipe(
      map(res => this.normalizeAgreement(res)),
      tap(agr => {
        this.selectedAgreement.set(agr);
        this.loading.set(false);
      }),
      catchError(err => {
        this.loading.set(false);
        throw err;
      })
    );
  }

  createAgreement(data: AgreementCreateRequest | any): Observable<Agreement> {
    this.loading.set(true);
    const payload: any = {
      student: data.student || data.studentId,
      session: data.session || data.tutoringSessionId || null,
      descripcion: data.descripcion || data.description || data.title || '',
      responsable: data.responsable || data.responsibleId,
      fecha_limite: data.fecha_limite || data.dueDate,
      estado: data.estado || data.status || 'PENDIENTE'
    };

    return this.http.post<any>(`${this.baseUrl}/`, payload).pipe(
      map(res => {
        const raw = res.agreement || res;
        return this.normalizeAgreement(raw);
      }),
      tap(created => {
        this.loading.set(false);
        this.agreements.update(list => [created, ...list.filter(a => a.id !== created.id)]);
      }),
      catchError(err => {
        this.loading.set(false);
        throw err;
      })
    );
  }

  updateAgreementStatus(
    id: number | string,
    newStatusOrReq: AgreementStatus | AgreementStatusUpdateRequest,
    comment?: string
  ): Observable<Agreement> {
    this.loading.set(true);
    let payload: { estado: AgreementStatus; comentario: string };

    if (typeof newStatusOrReq === 'string') {
      payload = {
        estado: newStatusOrReq,
        comentario: comment || ''
      };
    } else {
      payload = {
        estado: newStatusOrReq.estado || (newStatusOrReq as any).status || 'PENDIENTE',
        comentario: newStatusOrReq.comentario || (newStatusOrReq as any).resolutionNotes || ''
      };
    }

    return this.http.post<any>(`${this.baseUrl}/${id}/update-status/`, payload).pipe(
      map(res => {
        const raw = res.agreement || res;
        return this.normalizeAgreement(raw);
      }),
      tap(updated => {
        this.loading.set(false);
        this.agreements.update(list => list.map(a => a.id === Number(id) ? updated : a));
      }),
      catchError(err => {
        this.loading.set(false);
        throw err;
      })
    );
  }

  getAuditLogs(id: number | string): Observable<AgreementAuditLog[]> {
    return this.http.get<AgreementAuditLog[]>(`${this.baseUrl}/${id}/audit-logs/`).pipe(
      catchError(() => of([]))
    );
  }
}

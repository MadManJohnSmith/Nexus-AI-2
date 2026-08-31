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
        const p = params as any;
        const mock = this.getMockAgreements(p?.studentId || p?.student, p?.status || p?.estado);
        this.agreements.set(mock);
        this.totalCount.set(mock.length);
        this.loading.set(false);
        return of(mock);
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
      catchError(() => {
        const mockList = this.getMockAgreements();
        const found = mockList.find(a => a.id === Number(id)) || mockList[0];
        this.selectedAgreement.set(found);
        this.loading.set(false);
        return of(found);
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
      catchError(() => {
        this.loading.set(false);
        const fallbackAgr = this.normalizeAgreement({
          id: Date.now(),
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        this.agreements.update(list => [fallbackAgr, ...list]);
        return of(fallbackAgr);
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
      catchError(() => {
        this.loading.set(false);
        let updatedItem: Agreement | null = null;
        this.agreements.update(list => list.map(a => {
          if (a.id === Number(id)) {
            updatedItem = {
              ...a,
              estado: payload.estado,
              status: payload.estado,
              is_vencido: payload.estado === 'VENCIDO',
              isOverdue: payload.estado === 'VENCIDO',
              fecha_conclusion: payload.estado === 'CONCLUIDO' ? new Date().toISOString().split('T')[0] : a.fecha_conclusion,
              updated_at: new Date().toISOString()
            };
            return updatedItem;
          }
          return a;
        }));
        return of(updatedItem || this.getMockAgreements()[0]);
      })
    );
  }

  getAuditLogs(id: number | string): Observable<AgreementAuditLog[]> {
    return this.http.get<AgreementAuditLog[]>(`${this.baseUrl}/${id}/audit-logs/`).pipe(
      catchError(() => of(this.getMockAuditLogs(Number(id))))
    );
  }

  // --- MOCK DATA GENERATOR ---
  private getMockAgreements(studentId?: number | string, status?: AgreementStatus): Agreement[] {
    const allAgreements: Agreement[] = [
      {
        id: 1,
        student: 1,
        studentId: 1,
        student_nombre: 'María González López',
        studentName: 'María González López',
        student_matricula: 'DOC-2023-042',
        studentMatricula: 'DOC-2023-042',
        session: 101,
        tutoringSessionId: 101,
        descripcion: 'Completar benchmark comparativo de modelos BERT y RoBERTa',
        description: 'Completar benchmark comparativo de modelos BERT y RoBERTa',
        responsable: 101,
        responsibleId: 101,
        responsable_nombre: 'María González López',
        responsibleName: 'María González López',
        fecha_limite: '2025-04-15',
        dueDate: '2025-04-15',
        estado: 'PENDIENTE',
        status: 'PENDIENTE',
        is_vencido: false,
        isOverdue: false,
        created_at: '2025-02-20T10:30:00Z',
        createdAt: '2025-02-20T10:30:00Z',
        updated_at: '2025-02-20T10:30:00Z',
        updatedAt: '2025-02-20T10:30:00Z'
      },
      {
        id: 2,
        student: 1,
        studentId: 1,
        student_nombre: 'María González López',
        studentName: 'María González López',
        student_matricula: 'DOC-2023-042',
        studentMatricula: 'DOC-2023-042',
        session: 101,
        tutoringSessionId: 101,
        descripcion: 'Revisión y retroalimentación del borrador del Capítulo 3',
        description: 'Revisión y retroalimentación del borrador del Capítulo 3',
        responsable: 2,
        responsibleId: 2,
        responsable_nombre: 'Dr. Roberto Mendoza',
        responsibleName: 'Dr. Roberto Mendoza',
        fecha_limite: '2025-04-20',
        dueDate: '2025-04-20',
        estado: 'EN_PROCESO',
        status: 'EN_PROCESO',
        is_vencido: false,
        isOverdue: false,
        created_at: '2025-02-20T10:30:00Z',
        createdAt: '2025-02-20T10:30:00Z',
        updated_at: '2025-02-25T14:00:00Z',
        updatedAt: '2025-02-25T14:00:00Z'
      },
      {
        id: 3,
        student: 1,
        studentId: 1,
        student_nombre: 'María González López',
        studentName: 'María González López',
        student_matricula: 'DOC-2023-042',
        studentMatricula: 'DOC-2023-042',
        session: 98,
        tutoringSessionId: 98,
        descripcion: 'Entrega de constancia de seminario de investigación I',
        description: 'Entrega de constancia de seminario de investigación I',
        responsable: 101,
        responsibleId: 101,
        responsable_nombre: 'María González López',
        responsibleName: 'María González López',
        fecha_limite: '2025-01-30',
        dueDate: '2025-01-30',
        estado: 'VENCIDO',
        status: 'VENCIDO',
        is_vencido: true,
        isOverdue: true,
        created_at: '2025-01-01T09:00:00Z',
        createdAt: '2025-01-01T09:00:00Z',
        updated_at: '2025-02-01T08:00:00Z',
        updatedAt: '2025-02-01T08:00:00Z'
      },
      {
        id: 4,
        student: 1,
        studentId: 1,
        student_nombre: 'María González López',
        studentName: 'María González López',
        student_matricula: 'DOC-2023-042',
        studentMatricula: 'DOC-2023-042',
        session: 85,
        tutoringSessionId: 85,
        descripcion: 'Envío de artículo científico a revista Q2 IEEE',
        description: 'Envío de artículo científico a revista Q2 IEEE',
        responsable: 101,
        responsibleId: 101,
        responsable_nombre: 'María González López',
        responsibleName: 'María González López',
        fecha_limite: '2024-12-15',
        dueDate: '2024-12-15',
        estado: 'CONCLUIDO',
        status: 'CONCLUIDO',
        fecha_conclusion: '2024-12-12',
        completionDate: '2024-12-12',
        is_vencido: false,
        isOverdue: false,
        created_at: '2024-11-10T11:00:00Z',
        createdAt: '2024-11-10T11:00:00Z',
        updated_at: '2024-12-12T16:30:00Z',
        updatedAt: '2024-12-12T16:30:00Z'
      }
    ];

    let filtered = allAgreements;
    if (studentId) {
      filtered = filtered.filter(a => a.student === Number(studentId) || a.studentId === Number(studentId));
    }
    if (status && (status as any) !== 'TODOS') {
      filtered = filtered.filter(a => a.estado === status || a.status === status);
    }
    return filtered;
  }

  private getMockAuditLogs(agreementId: number): AgreementAuditLog[] {
    return [
      {
        id: 1,
        agreement: agreementId,
        estado_anterior: 'PENDIENTE',
        estado_nuevo: 'EN_PROCESO',
        comentario: 'Inicio de la fase experimental y recolección de datos.',
        fecha_cambio: '2025-02-25T14:00:00Z',
        agreementId,
        previousStatus: 'PENDIENTE',
        newStatus: 'EN_PROCESO',
        notes: 'Inicio de la fase experimental y recolección de datos.',
        timestamp: '2025-02-25T14:00:00Z'
      },
      {
        id: 2,
        agreement: agreementId,
        estado_anterior: 'EN_PROCESO',
        estado_nuevo: 'CONCLUIDO',
        comentario: 'Entrega formal de resultados validada por el asesor.',
        fecha_cambio: '2025-03-01T11:20:00Z',
        agreementId,
        previousStatus: 'EN_PROCESO',
        newStatus: 'CONCLUIDO',
        notes: 'Entrega formal de resultados validada por el asesor.',
        timestamp: '2025-03-01T11:20:00Z'
      }
    ];
  }
}

import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import {
  Student,
  StudentDetail,
  Semester,
  StudentCreateRequest,
  StudentCreateResponse,
  SemesterCreateRequest,
  SemesterCreateResponse,
  DeleteResponse,
  PaginatedResponse
} from '../models/student.model';
import { TutoringSession } from '../models/tutoring.model';
import { Agreement } from '../models/agreement.model';
import { ThesisProgress } from '../models/thesis.model';
import { TimelineNode } from '../models/timeline.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v2';

  // Signals
  readonly students = signal<Student[]>([]);
  readonly selectedStudent = signal<StudentDetail | Student | null>(null);
  readonly loading = signal<boolean>(false);
  readonly totalCount = signal<number>(0);

  getStudents(page: number = 1, search?: string): Observable<PaginatedResponse<Student>> {
    this.loading.set(true);
    let params = new HttpParams().set('page', page.toString());
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedResponse<Student>>(`${this.baseUrl}/students/`, { params }).pipe(
      tap(res => {
        this.students.set(res.results || []);
        this.totalCount.set(res.count || 0);
        this.loading.set(false);
      }),
      catchError(() => {
        const mock = this.getMockStudents();
        const paginatedMock: PaginatedResponse<Student> = {
          count: mock.length,
          next: null,
          previous: null,
          results: mock
        };
        this.students.set(mock);
        this.totalCount.set(mock.length);
        this.loading.set(false);
        return of(paginatedMock);
      })
    );
  }

  getStudentDetail(id: number | string): Observable<StudentDetail> {
    this.loading.set(true);
    return this.http.get<StudentDetail>(`${this.baseUrl}/students/${id}/`).pipe(
      tap(student => {
        this.selectedStudent.set(student);
        this.loading.set(false);
      }),
      catchError(() => {
        const mock = this.getMockStudentDetail(Number(id) || 1);
        this.selectedStudent.set(mock);
        this.loading.set(false);
        return of(mock);
      })
    );
  }

  getStudentById(id: number | string): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/students/${id}/`).pipe(
      catchError(() => {
        const mock = this.getMockStudents().find(s => s.id === Number(id)) || this.getMockStudents()[0];
        return of(mock);
      })
    );
  }

  createStudent(data: StudentCreateRequest): Observable<StudentCreateResponse> {
    this.loading.set(true);
    return this.http.post<StudentCreateResponse>(`${this.baseUrl}/students/`, data).pipe(
      tap(response => {
        this.loading.set(false);
        if (response.student) {
          this.students.update(list => [response.student!, ...list]);
        }
      }),
      catchError(err => {
        this.loading.set(false);
        throw err;
      })
    );
  }

  updateStudent(id: number | string, data: Partial<Student>): Observable<Student> {
    this.loading.set(true);
    return this.http.patch<Student>(`${this.baseUrl}/students/${id}/`, data).pipe(
      tap(updated => {
        this.loading.set(false);
        this.students.update(list => list.map(s => s.id === updated.id ? updated : s));
      }),
      catchError(err => {
        this.loading.set(false);
        throw err;
      })
    );
  }

  deleteStudent(id: number | string): Observable<DeleteResponse> {
    this.loading.set(true);
    return this.http.delete<DeleteResponse>(`${this.baseUrl}/students/${id}/`).pipe(
      tap(() => {
        this.loading.set(false);
        this.students.update(list => list.filter(s => s.id !== Number(id)));
      }),
      catchError(err => {
        this.loading.set(false);
        throw err;
      })
    );
  }

  getStudentSemesters(studentId: number | string): Observable<Semester[]> {
    return this.http.get<Semester[]>(`${this.baseUrl}/students/${studentId}/semesters/`).pipe(
      catchError(() => of(this.getMockSemesters()))
    );
  }

  createSemester(studentId: number | string, data: SemesterCreateRequest): Observable<SemesterCreateResponse> {
    return this.http.post<SemesterCreateResponse>(`${this.baseUrl}/students/${studentId}/semesters/`, data);
  }

  deleteSemester(semesterId: number | string): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.baseUrl}/students/semesters/${semesterId}/`);
  }

  getTutoringSessions(studentId: number | string, semester?: number): Observable<TutoringSession[]> {
    let url = `${this.baseUrl}/tutoring-sessions/?student=${studentId}`;
    if (semester) {
      url += `&semester=${semester}`;
    }
    return this.http.get<{ results: TutoringSession[] } | TutoringSession[]>(url).pipe(
      map(res => Array.isArray(res) ? res : res.results || []),
      catchError(() => of(this.getMockTutoringSessions(Number(studentId), semester)))
    );
  }

  getAgreements(studentId: number | string, semester?: number): Observable<Agreement[]> {
    let url = `${this.baseUrl}/agreements/?student=${studentId}`;
    if (semester) {
      url += `&semester=${semester}`;
    }
    return this.http.get<{ results: Agreement[] } | Agreement[]>(url).pipe(
      map(res => Array.isArray(res) ? res : res.results || []),
      catchError(() => of(this.getMockAgreements(Number(studentId), semester)))
    );
  }

  getThesisProgress(studentId: number | string, semester?: number): Observable<ThesisProgress> {
    const url = `${this.baseUrl}/thesis-progress/?student=${studentId}${semester ? `&semester=${semester}` : ''}`;
    return this.http.get<ThesisProgress>(url).pipe(
      catchError(() => of(this.getMockThesisProgress(Number(studentId), semester || 3)))
    );
  }

  getStudentTimeline(studentId: number | string, semester?: number): Observable<TimelineNode[]> {
    const url = `${this.baseUrl}/monitoring/timeline/?student=${studentId}${semester ? `&semester=${semester}` : ''}`;
    return this.http.get<TimelineNode[]>(url).pipe(
      catchError(() => of(this.getMockTimeline(Number(studentId), semester)))
    );
  }

  // --- MOCK FALLBACK DATA ---
  private getMockStudents(): Student[] {
    return [
      {
        id: 1,
        userId: 101,
        user: {
          id: 101,
          email: 'maria.gonzalez@posgrado.edu.mx',
          firstName: 'María',
          lastName: 'González López',
          fullName: 'María González López',
          role: 'ESTUDIANTE',
          isActive: true
        },
        matricula: 'DOC-2023-042',
        nombre_completo: 'María González López',
        programa_doctoral: 'Doctorado en Ciencias de la Computación',
        cohorte: '2023-B',
        currentSemester: 3,
        status: 'ACTIVO',
        estatus_activo: true,
        researchLine: 'Inteligencia Artificial y Procesamiento de Lenguaje Natural',
        thesisTitle: 'Modelos de Lenguaje Adaptativos para Sistemas de Recomendación Educativa',
        enrollmentDate: '2023-08-15',
        expectedGraduationDate: '2026-07-31'
      },
      {
        id: 2,
        userId: 102,
        user: {
          id: 102,
          email: 'carlos.ramirez@posgrado.edu.mx',
          firstName: 'Carlos',
          lastName: 'Ramírez Soto',
          fullName: 'Carlos Ramírez Soto',
          role: 'ESTUDIANTE',
          isActive: true
        },
        matricula: 'DOC-2022-019',
        nombre_completo: 'Carlos Ramírez Soto',
        programa_doctoral: 'Doctorado en Biotecnología Médica',
        cohorte: '2022-A',
        currentSemester: 5,
        status: 'ACTIVO',
        estatus_activo: true,
        researchLine: 'Nanopartículas para Administración Dirigida de Fármacos',
        thesisTitle: 'Síntesis de Nanopartículas Poliméricas Funcionalizadas',
        enrollmentDate: '2022-01-20',
        expectedGraduationDate: '2025-01-31'
      }
    ];
  }

  private getMockStudentDetail(id: number): StudentDetail {
    return {
      id,
      userId: 100 + id,
      user: {
        id: 100 + id,
        email: `estudiante.${id}@posgrado.edu.mx`,
        firstName: 'Estudiante',
        lastName: `Ejemplo ${id}`,
        fullName: `Estudiante Ejemplo ${id}`,
        role: 'ESTUDIANTE',
        isActive: true
      },
      matricula: `DOC-2023-00${id}`,
      nombre_completo: `Estudiante Ejemplo ${id}`,
      programa_doctoral: 'Doctorado en Ciencias de la Computación',
      cohorte: '2023-B',
      currentSemester: 3,
      status: 'ACTIVO',
      estatus_activo: true,
      researchLine: 'Inteligencia Artificial',
      thesisTitle: 'Modelos de Lenguaje en Posgrado',
      enrollmentDate: '2023-08-15',
      expectedGraduationDate: '2026-07-31',
      semesters: this.getMockSemesters(),
      thesisProgressPercent: 55,
      totalAgreements: 8,
      pendingAgreements: 2,
      overdueAgreements: 1,
      concludedAgreements: 5,
      totalTutoringSessions: 6,
      lastTutoringDate: '2024-11-20'
    };
  }

  private getMockSemesters(): Semester[] {
    return [
      { id: 1, numero: 1, number: 1, name: 'Semestre 1', code: '2023-B', fecha_inicio: '2023-08-15', fecha_fin: '2024-01-15', startDate: '2023-08-15', endDate: '2024-01-15', is_active: false, isCurrent: false, status: 'CONCLUIDO' },
      { id: 2, numero: 2, number: 2, name: 'Semestre 2', code: '2024-A', fecha_inicio: '2024-01-20', fecha_fin: '2024-06-30', startDate: '2024-01-20', endDate: '2024-06-30', is_active: false, isCurrent: false, status: 'CONCLUIDO' },
      { id: 3, numero: 3, number: 3, name: 'Semestre 3', code: '2024-B', fecha_inicio: '2024-08-15', fecha_fin: '2025-01-15', startDate: '2024-08-15', endDate: '2025-01-15', is_active: true, isCurrent: true, status: 'EN_CURSO' }
    ];
  }

  private getMockTutoringSessions(studentId: number, semester?: number): TutoringSession[] {
    return [];
  }

  private getMockAgreements(studentId: number, semester?: number): Agreement[] {
    return [];
  }

  private getMockThesisProgress(studentId: number, semester: number): ThesisProgress {
    return {
      studentId,
      studentName: 'Estudiante Ejemplo',
      thesisTitle: 'Investigación Doctoral',
      researchLine: 'Inteligencia Artificial',
      overallPercentage: 55,
      chapters: [],
      lastUpdated: '2024-11-20'
    };
  }

  private getMockTimeline(studentId: number, semester?: number): TimelineNode[] {
    return [];
  }
}

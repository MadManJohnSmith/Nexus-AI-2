# Scrum of Scrums — Sprint 6
**Proyecto:** N.E.X.U.S. (Núcleo de Expediente y Seguimiento Universitario Superior)  
**Sprint:** 6 (Release Candidate 1.0 y Cierre)  
**Representantes:** Dev 1 (Equipo 1), Dev 6 (Equipo 2), Dev 11 (Equipo 3)  
**Moderador:** nexus-orchestrator (Tech Lead)

---

## 1. Acuerdos de Integración Técnica y Cierre de Arquitectura

### A) Certificación de Índices y Consistencia de Base de Datos
- **Índices Activos:** `TutoringSession.fecha_sesion`, `Agreement.fecha_limite`, `Agreement.estado`, `ThesisProgress.fecha_registro`, `Evidence.fecha_carga`, `Evidence.actividad_tipo`, `Evidence.actividad_id`.
- **Estado de Migraciones:** `python manage.py makemigrations --check` ejecutado sin inconsistencias. Soporte total para SQLite y MySQL.

### B) Auditoría de Seguridad RBAC y Aislamiento de Roles
- **Coordinadores / Superadministradores:** Acceso global a todas las métricas, expediente 360°, semáforos de riesgo y exportación.
- **Asesores:** Aislamiento a nivel de objeto para tesistas asignados a sus comités tutoriales activos.
- **Estudiantes:** Restricción exclusiva a su propio expediente e historial académico.

### C) Compilación Limpia de Frontend Angular 20 Standalone
- Compilación de producción ejecutada con `npm run build`:
  * **0 errores, 0 warnings**
  * Bundles optimizados con Lazy Loading por ruta y Control Flow nativo (`@if`, `@for`).

### D) Script de Inicialización de Datos Maestros (`seed_data.py`)
- Población de base de datos verificada: 1 Superadmin, 1 Coordinador, 5 Asesores, 10 Estudiantes distribuidos en semestres 1 a 6, 68 Sesiones de tutoría, 40 Acuerdos, 34 Avances de tesis, 20 Evidencias y 35 Productos científicos.

---

## 2. Árbol de Commits y Trazabilidad Git Global (`git log --graph --oneline --all`)

```text
* 14fc82e docs(sprint-5): add sprint 5 scrum ceremony deliverables, review, retrospective and team collaboration logs
*   2862690 merge(PR-E1-28): integrate tabular and PDF export engine
|\  
| * 6c35c04 feat(HU-28): implement multi-sheet Excel and institutional PDF export engine
|/  
*   2ca3f0e merge(PR-E3-27): integrate full dossier report and print view
|\  
| * e12d25d feat(HU-27): implement full dossier consolidated endpoint and official print-ready report view
* |   753b1ce merge(PR-E2-26): integrate supervision rules engine
|\ \  
| |/  
|/|   
| * 18d71a3 feat(HU-26): implement SupervisionRulesEngine and supervision alerts endpoint
|/  
* 4e5452a docs(sprint-4): add sprint 4 scrum ceremony deliverables, review, retrospective and team collaboration logs
*   ad0ab12 merge(PR-E1-20): integrate other academic products
|\  
| * 3765636 feat(HU-20): implement OtherProduct model, endpoints and frontend tabs
|/  
*   87a5f0a merge(PR-E3-24): integrate coordinator dashboard and expanded timeline
|\  
| * db12ab7 feat(HU-24): implement coordinator dashboard KPIs, risk semaphore and timeline expansion
|/  
*   8edeadd merge(PR-E2-16): integrate thesis progress history and chart
|\  
| * f51a6cb feat(HU-16): implement thesis progress history endpoint and comparative evolution chart
|/  
*   c12eef4 merge(PR-E1-19): integrate research stays module
|\  
| * 42bf353 feat(HU-19): implement ResearchStay model and stay tracking
|/  
*   69d788a merge(PR-E1-18): integrate academic events module
|\  
| * 76a4858 feat(HU-18): implement AcademicEvent model, endpoints and tests
|/  
*   b09064d merge(PR-E1-17): integrate publications module
|\  
| * d3c5e52 feat(HU-17): implement Publication model, serializers, views and tests
|/  
* db5f839 docs(sprint-3): add sprint 3 scrum ceremony deliverables, integration report and certified MVP audit logs
*   2f6158a merge(PR-E3-23): integrate longitudinal timeline
|\  
| * 6dc26db feat(HU-23): implement longitudinal timeline endpoint with flyout drawer
|/  
*   131f41b merge(PR-E2-22): integrate evidence storage and DOI validation
|\  
| * 3a6ae61 feat(HU-22): implement DOI and permanent URL validation
|/  
*   305b085 merge(PR-E2-21): integrate evidence storage
|\  
| * cd2094d feat(HU-21): implement Evidence model, storage viewset and tests
|/  
*   50ae57d merge(PR-E2-15): integrate thesis progress module
|\  
| * a824fa1 feat(HU-15): implement ThesisProgress model, 6-component rubric, serializer and views
|/  
*   874895a merge(PR-E3-25): integrate reactive alerts and status update
|\  
| * 0207038 feat(HU-25): implement reactive overdue alerts in dashboard and agreements status update
|/  
*   6399b6f merge(PR-E1-refactor): integrate tutoring ORM optimization and timeline feed
|\  
| * 76f8092 refactor(tutoring): add select_related and prefetch_related optimizations and timeline feed
|/  
* f5d27aa docs(sprint-2): add sprint 2 scrum ceremony deliverables, integration report and certified MVP audit logs
*   ebfaeb2 merge(PR-E3-14): integrate agreements frontend list view and student overview
|\  
| * 532e088 feat(HU-14): implement agreements list view, filters and student overview integration
|/  
*   fbc9785 merge(PR-E2-13): integrate agreements state machine and audit log
|\  
| * 6ff30ff feat(HU-13): implement agreements state machine, transition endpoints and audit log
|/  
*   ca923e6 merge(PR-E2-12): integrate agreements assignment and responsible tracking
|\  
| * 7b86483 feat(HU-12): implement agreement assignment and responsible tracking
|/  
*   5dfcb50 merge(PR-E2-11): integrate agreements creation and tracking module
|\  
| * de95f9c feat(HU-11): implement Agreement model, serializers and create endpoint
|/  
*   e774780 merge(PR-E1-10): integrate next meeting calendar endpoint
|\  
| * 6927d6a feat(HU-10): implement next meeting calendar endpoint and validation
|/  
*   bbef92f merge(PR-E1-09): integrate progress observations
|\  
| * be51f62 feat(HU-09): implement TutoringObservation model, serializer and modal section
|/  
*   fe5aa9b merge(PR-E1-08): integrate tutoring participants
|\  
| * 7578be9 feat(HU-08): implement TutoringParticipant model and participant management
|/  
*   e29783f merge(PR-E1-07): integrate tutoring session module
|\  
| * d36da41 feat(HU-07): implement TutoringSession model, serializers and views
|/  
* 8011c75 docs(sprint-1): add sprint 1 scrum ceremony deliverables, integration report and certified MVP audit logs
*   36780c1 merge(PR-E3-06): integrate navigation and responsive layout
|\  
| * bff3045 feat(HU-06): implement navigation, routes and responsive layout integration
|/  
*   f2c1f01 merge(PR-E3-05): integrate pill-badge component
|\  
| * a0907d7 feat(HU-05): implement reusable PillBadgeComponent with institutional color tokens
|/  
*   9e09968 merge(PR-E3-04): integrate AppShellComponent and StudentOverviewComponent
|\  
| * 1c6c06b feat(HU-04): implement AppShell and StudentOverview layouts with 70/30 grid
|/  
*   b6db760 merge(PR-E2-03): integrate AcademicCommittee module and committee assignment endpoints
|\  
| * 6788db1 feat(HU-03): implement AcademicCommittee model, serializers, views and tests
|/  
*   59c25f4 merge(PR-E2-02): integrate RBAC permissions system
|\  
| * b39bf9a feat(HU-02): implement RBAC permissions, role isolation and security tests
|/  
*   32a933f merge(PR-E1-01): integrate CustomUser and Student modules
|\  
| * f98faea feat(HU-01): implement CustomUser, Student models, auth endpoints, JWT and login
|/  
* a1e0657 chore: initial commit - empty repo
```

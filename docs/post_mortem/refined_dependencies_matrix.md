# N.E.X.U.S. - Matriz de Dependencias Técnicas Refinada (HU-01 a HU-28)
**Fase:** Post-Mortem & Release Candidate 1.0 (Sprint 6)  
**Autor:** Project Manager & Scrum Master (Dev 13)  
**Revisores:** Tech Lead (Dev 11), Technical Writer (Dev 14)  

---

## 1. Introducción y Metodología
A lo largo de los 6 Sprints del proyecto N.E.X.U.S., se implementaron **28 Historias de Usuario** distribuidas entre 3 Equipos Scrum paralelos (15 Desarrolladores).

Para evitar bloqueos y colisiones arquitectónicas, se aplicó un modelo de **Contratos API First (OpenAPI v2.0)** y una gestión rigurosa de dependencias directas e indirectas. A continuación se presenta la matriz técnica completa, el mapa de acoplamiento entre equipos y el análisis de la ruta crítica del sistema.

---

## 2. Matriz Exhaustiva de Dependencias por Historia de Usuario

| ID | Sprint | Equipo | Historia de Usuario | SP | Prerrequisitos (Upstream) | Impacta a (Downstream) | Contrato / Endpoint Clave |
| :--- | :---: | :---: | :--- | :---: | :--- | :--- | :--- |
| **HU-01** | 1 | Eq 1 | Autenticación JWT y Gestión de Sesión | 5 | Ninguno (Base de Infra) | HU-02, HU-03, HU-06, Todas | `POST /api/v2/auth/login/`, `POST /api/v2/auth/refresh/` |
| **HU-02** | 1 | Eq 2 | Control de Acceso Basado en Roles (RBAC) | 5 | HU-01 | HU-03, HU-04, HU-08, HU-24 | Permisos: `IsCoordinator`, `IsAssignedAdvisorOrStudent` |
| **HU-03** | 1 | Eq 1 | Registro y Padrón de Estudiantes | 5 | HU-01, HU-02 | HU-04, HU-05, HU-07, HU-08 | `GET/POST /api/v2/students/`, `GET /api/v2/students/{id}/` |
| **HU-04** | 1 | Eq 2 | Asignación de Comité Tutorial | 5 | HU-01, HU-02, HU-03 | HU-07, HU-08, HU-24, HU-26 | `POST /api/v2/students/{id}/committee/` |
| **HU-05** | 1 | Eq 1 | Catálogo y Gestión de Semestres (1-6) | 3 | HU-03 | HU-07, HU-08, HU-15, HU-23 | `GET/POST /api/v2/semesters/` |
| **HU-06** | 1 | Eq 3 | App Shell, Navegación y Sidebar | 5 | HU-01 | HU-07, HU-14, HU-23, HU-24 | Componente Angular: `<app-shell>`, `<app-sidebar>` |
| **HU-07** | 1 | Eq 3 | Vista General del Expediente (Overview) | 8 | HU-03, HU-04, HU-05, HU-06 | HU-08, HU-14, HU-23, HU-27 | Componente Angular: `<app-student-overview>` |
| **HU-08** | 2 | Eq 1 | Registro de Sesión de Tutoría | 8 | HU-03, HU-04, HU-05, HU-07 | HU-09, HU-10, HU-11, HU-23 | `POST /api/v2/tutoring-sessions/` |
| **HU-09** | 2 | Eq 1 | Edición y Consulta de Sesiones | 5 | HU-08 | HU-23, HU-27, HU-28 | `GET/PUT /api/v2/tutoring-sessions/{id}/` |
| **HU-10** | 2 | Eq 1 | Asistencia y Participantes de Tutoría | 5 | HU-08 | HU-23, HU-27, HU-28 | Nested DTO: `participants: [...]` |
| **HU-11** | 2 | Eq 2 | Creación de Acuerdos Vinculados | 5 | HU-03, HU-08 | HU-12, HU-13, HU-14, HU-25 | `POST /api/v2/agreements/` |
| **HU-12** | 2 | Eq 2 | Responsable y Fechas de Vencimiento | 3 | HU-11 | HU-13, HU-14, HU-25 | DTO: `responsable`, `fecha_limite` |
| **HU-13** | 2 | Eq 2 | Transición de Estados y Bitácora Auditoría | 5 | HU-11, HU-12 | HU-14, HU-25, HU-26, HU-27 | `PATCH /api/v2/agreements/{id}/status/` |
| **HU-14** | 2 | Eq 3 | Drawer Lateral de Acuerdos y Filtros | 8 | HU-06, HU-11, HU-12, HU-13 | HU-23, HU-27 | Componente Angular: `<app-agreements-drawer>` |
| **HU-15** | 3 | Eq 2 | Porcentaje y Registro de Avance de Tesis | 5 | HU-03, HU-05 | HU-16, HU-23, HU-24, HU-27 | `POST /api/v2/thesis/` |
| **HU-16** | 4 | Eq 2 | Desglose por Componentes e Historial Tesis | 5 | HU-15 | HU-23, HU-24, HU-27, HU-28 | `GET /api/v2/thesis/history/`, `componentes_json` |
| **HU-17** | 4 | Eq 1 | Registro de Publicaciones Científicas | 5 | HU-03, HU-05, HU-21 | HU-23, HU-24, HU-27, HU-28 | `GET/POST /api/v2/academic-output/publications/` |
| **HU-18** | 4 | Eq 1 | Registro de Eventos y Ponencias | 5 | HU-03, HU-05, HU-21 | HU-23, HU-27, HU-28 | `GET/POST /api/v2/academic-output/academic-events/` |
| **HU-19** | 4 | Eq 1 | Estancias de Investigación Doctorales | 5 | HU-03, HU-21 | HU-23, HU-27, HU-28 | `GET/POST /api/v2/academic-output/research-stays/` |
| **HU-20** | 4 | Eq 1 | Otros Productos: Software, Patentes | 5 | HU-03, HU-21 | HU-23, HU-27, HU-28 | `GET/POST /api/v2/academic-output/other-products/` |
| **HU-21** | 3 | Eq 2 | Repositorio de Evidencias (Archivos 15MB) | 5 | HU-01, HU-03, HU-05 | HU-17, HU-18, HU-19, HU-20 | `POST /api/v2/evidence/upload/` (multipart) |
| **HU-22** | 3 | Eq 2 | Evidencias Digitales por Enlace DOI/URL | 3 | HU-01, HU-03, HU-05 | HU-17, HU-23, HU-27 | `POST /api/v2/evidence/doi/` |
| **HU-23** | 3 | Eq 3 | Timeline Longitudinal Multi-Nodo | 8 | HU-08, HU-11, HU-15, HU-21 | HU-27 | `GET /api/v2/monitoring/timeline/?student={id}` |
| **HU-24** | 4 | Eq 3 | Dashboard Ejecutivo del Coordinador | 8 | HU-04, HU-15, HU-17, HU-25 | HU-26 | `GET /api/v2/monitoring/coordinator-dashboard/` |
| **HU-25** | 3 | Eq 3 | Alertas y Semáforos de Vencimiento | 5 | HU-11, HU-12, HU-13 | HU-24, HU-26 | `GET /api/v2/monitoring/alerts/?student={id}` |
| **HU-26** | 5 | Eq 2 | Motor de Reglas de Supervisión | 5 | HU-08, HU-13, HU-21, HU-25 | HU-24, HU-27 | `GET /api/v2/monitoring/supervision-alerts/` |
| **HU-27** | 5 | Eq 3 | Expediente Integral 360° (Full Dossier) | 8 | Todas las HUs previas (01 a 26) | HU-28 | `GET /api/v2/reporting/students/{id}/full-dossier/` |
| **HU-28** | 5 | Eq 1 | Motor de Exportación XLSX y PDF | 8 | HU-27, Todas las Apps | Release Candidate | `GET /api/v2/reporting/export/student/{id}/?format=pdf\|xlsx` |

---

## 3. Análisis de la Ruta Crítica (Critical Path Analysis)

El análisis del grafo de dependencias identifica la siguiente secuencia de ruta crítica fundamental:

$$\text{HU-01 (Auth)} \longrightarrow \text{HU-03 (Students)} \longrightarrow \text{HU-08 (Tutoring)} \longrightarrow \text{HU-11/13 (Agreements)} \longrightarrow \text{HU-15 (Thesis)} \longrightarrow \text{HU-23 (Timeline)} \longrightarrow \text{HU-27 (Full Dossier)} \longrightarrow \text{HU-28 (Export Engines)}$$

### Puntos de Acoplamiento y Mitigaciones Implementadas
1. **Acoplamiento Eq 1 $\leftrightarrow$ Eq 2 en Acuerdos (HU-08 y HU-11):**
   - *Riesgo:* `Agreement` requería la `TutoringSession` de Equipo 1.
   - *Mitigación:* Se definió `session` como `ForeignKey(null=True, blank=True)` permitiendo acuerdos independientes o vinculados sin bloquear el desarrollo de Equipo 2.
2. **Acoplamiento Eq 2 $\leftrightarrow$ Eq 1 en Producción Académica y Evidencias (HU-21 y HU-17..20):**
   - *Riesgo:* Publicaciones requerían comprobantes documentales desarrollados por Equipo 2.
   - *Mitigación:* Se utilizó el patrón de asociación flexible `evidencia = models.ForeignKey(Evidence, null=True, on_delete=models.SET_NULL)`.
3. **Acoplamiento Eq 3 $\leftrightarrow$ Eq 1 y Eq 2 en Dossier y Exportación (HU-27 y HU-28):**
   - *Riesgo:* El Full Dossier y los motores de exportación PDF/Excel requerían el 100% de los serializadores backend estabilizados.
   - *Mitigación:* En Sprint 3 se ejecutó `HU-refactor` que congeló los contratos DTO v2.0 normalizados en snake_case/camelCase.

---

## 4. Conclusión de la Gestión de Dependencias
El desacoplamiento basado en contratos REST v2.0, el uso de foreign keys con nulabilidad estratégica y la sincronización continua en los Daily Scrums y Scrum of Scrums permitieron que los 15 desarrolladores completaran las 28 historias en 6 Sprints sin una sola reversión de código en la rama principal.

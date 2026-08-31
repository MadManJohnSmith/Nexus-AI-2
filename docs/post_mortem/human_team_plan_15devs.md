# N.E.X.U.S. - Plan de Trabajo Operativo para Equipo de 15 Desarrolladores
**Fase:** Post-Mortem & Release Candidate 1.0 (Sprint 6)  
**Autor:** Project Manager & Scrum Master (Dev 13)  
**Aprobado por:** Tech Lead & Meta-Arquitecto (Dev 11)  

---

## 1. Estructura y Composición del Equipo de Desarrollo (15 Devs)

El equipo de ingeniería de N.E.X.U.S. se organizó en 3 Escuadrones Scrum multidisciplinarios de 5 integrantes cada uno, operando bajo un marco de desarrollo ágil con integración continua:

```
                               ┌────────────────────────┐
                               │   nexus-orchestrator   │
                               │  Tech Lead & Arquitecto │
                               └───────────┬────────────┘
                ┌──────────────────────────┼──────────────────────────┐
                ▼                          ▼                          ▼
   ┌─────────────────────────┐┌─────────────────────────┐┌─────────────────────────┐
   │        EQUIPO 1         ││        EQUIPO 2         ││        EQUIPO 3         │
   │      (Devs 1 a 5)       ││      (Devs 6 a 10)      ││     (Devs 11 a 15)      │
   │  Identity, Students,    ││  RBAC, Agreements,      ││ Monitoring Dashboard,   │
   │  Tutoring, Prod. Acad., ││  Thesis, Evidence,      ││ Full Dossier, Reporting │
   │  Export Engine          ││  Supervision Rules      ││ App Shell & Timeline    │
   └─────────────────────────┘└─────────────────────────┘└─────────────────────────┘
```

---

## 2. Asignación Individual de Roles y Especialidades

### 2.1. Equipo 1: Núcleo de Estudiantes, Tutorías y Motores de Exportación
- **Dev 1 (Tech Lead Equipo 1):** Arquitectura de `identity` y `students`, autenticación JWT, configuración base Django REST Framework.
- **Dev 2 (Backend Senior):** Modelado ORM y endpoints de `tutoring` (sesiones y participantes), optimizaciones con `select_related`/`prefetch_related`.
- **Dev 3 (Backend Engineer):** Módulo `academic_output` (publicaciones, eventos, estancias de investigación, otros productos).
- **Dev 4 (Reporting & Export Specialist):** Implementación de motores de exportación `openpyxl` (Excel multi-hoja) y `ReportLab` (PDF institucional) en `reporting`.
- **Dev 5 (Frontend Angular Developer):** Formularios de registro de tutoría en Angular 20, tablas reactivas, validadores de interfaz y clientes HTTP para exportación.

### 2.2. Equipo 2: Seguridad RBAC, Acuerdos, Tesis y Repositorio de Evidencias
- **Dev 6 (Tech Lead Equipo 2):** Jerarquía de permisos RBAC en `identity`, asignación de comités tutoriales en `students`.
- **Dev 7 (Backend Senior):** Módulo `agreements` (gestión de compromisos, transiciones de estado y bitácora `AgreementAuditLog`).
- **Dev 8 (Backend Engineer):** Módulo `thesis` (seguimiento cuantitativo y desglose de 6 componentes de tesis doctoral).
- **Dev 9 (Storage & Security Engineer):** Módulo `evidence` (validación estricta de archivos 15MB, MIME types, DOIs y almacenamiento seguro).
- **Dev 10 (Rule Engine Specialist):** Implementación del motor analítico de supervisión y alertas automatizadas en `monitoring/supervision_rules.py`.

### 2.3. Equipo 3: Experiencia de Usuario, Timeline, Dashboard Ejecutivo y Full Dossier
- **Dev 11 (Tech Lead Global / Backend Lead):** Arquitectura integral del sistema, unificación de DTOs v2.0, ERD y validación de contratos OpenAPI.
- **Dev 12 (Database & Performance Specialist):** Optimización de consultas SQL/ORM, diseño de índices `db_index`, esquemas de migración y mitigación de problemas $N+1$.
- **Dev 13 (PM & Scrum Master):** Gobernanza del Sprint Backlog, matrices de dependencias, actas de Scrum of Scrums y facilitación de bloqueos.
- **Dev 14 (Frontend UI/UX Architect & Technical Writer):** App Shell, diseño del Timeline longitudinal reactivo, Dashboard Ejecutivo del Coordinador con Signals de Angular 20, y documentación técnica post-mortem.
- **Dev 15 (QA & Automated Testing Lead):** Diseño de la suite de 111 pruebas unitarias y de integración en backend, validación de criterios DoD y pruebas de carga.

---

## 3. Plan Operativo y Desglose de Historias por Sprint (Sprints 1 a 6)

| Sprint | Equipo 1 (Devs 1-5) | Equipo 2 (Devs 6-10) | Equipo 3 (Devs 11-15) | Total SP | Hito de Cierre |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **Sprint 1** | **HU-01:** Auth JWT (5)<br>**HU-03:** Students CRUD (5)<br>**HU-05:** Semestres 1-6 (3) | **HU-02:** RBAC Matrix (5)<br>**HU-04:** Comité Tutorial (5) | **HU-06:** App Shell & Nav (5)<br>**HU-07:** Student Overview (8)<br>Config Angular CLI (Dev 14) | **36 SP** | Base arquitectónica integrada, login JWT, vista general del estudiante activa. |
| **Sprint 2** | **HU-08:** Sesión Tutoría (8)<br>**HU-09:** Edición Sesiones (5)<br>**HU-10:** Asistencia/Participantes (5) | **HU-11:** Acuerdos Vinculados (5)<br>**HU-12:** Responsable/Plazos (3)<br>**HU-13:** Audit Log Acuerdos (5) | **HU-14:** Drawer de Acuerdos (8)<br>Filtros por Estado y Semáforo<br>Pruebas de Integración (Dev 15) | **39 SP** | Flujo completo de tutorías, compromisos derivados y auditoría de cambios. |
| **Sprint 3** | **HU-refactor:** Normalización DTO v2.0 y optimizaciones ORM (5) | **HU-15:** Avance de Tesis (5)<br>**HU-21:** Evidencias Archivos 15MB (5)<br>**HU-22:** Evidencias Enlaces DOI (3) | **HU-23:** Timeline Multi-Nodo (8)<br>**HU-25:** Alertas de Vencimiento (5)<br>Métricas de Rendimiento (Dev 12) | **31 SP** | Timeline interactivo con 5 tipos de nodos, repositorio de archivos y DOIs. |
| **Sprint 4** | **HU-17:** Publicaciones JCR (5)<br>**HU-18:** Eventos/Ponencias (5)<br>**HU-19:** Estancias Investig. (5)<br>**HU-20:** Otros Productos (5) | **HU-16:** Historial y 6 Componentes de Tesis Doctoral (5) | **HU-24:** Dashboard del Coordinador (8)<br>KPIs Globales, Semáforo de Riesgo,<br>Distribución de Cohortes (Dev 14) | **33 SP** | Registro completo de producción científica y panel de analítica para coordinación. |
| **Sprint 5** | **HU-28:** Exportación Excel XLSX Multi-hoja y PDF Institucional (8) | **HU-26:** Motor de Reglas de Supervisión Automatizada (5) | **HU-27:** Full Dossier 360° (8)<br>Integración de todas las HUs previas<br>Validación de Reglas de Negocio | **21 SP** | Expediente longitudinal consolidado, reportes descargables y alertas automáticas. |
| **Sprint 6** | Auditoría y Certificación de Endpoints de Exportación (Devs 1-5) | Verificación de Migraciones y Consistencia de Base de Datos (Devs 6-10) | **Release Candidate 1.0:**<br>111 Pruebas Unitarias (Dev 15)<br>ERD Exhaustivo (Dev 11)<br>Documentación Post-Mortem (Devs 12-14) | **Cierre** | **100% de DoD cumplido.** 111 pruebas pasando en 5.4s. Sistema listo para producción. |

---

## 4. Matriz de Revisión Cruzada de Código (Cross-PR Review Matrix)

Para garantizar la calidad del software y eliminar silos de conocimiento, se instituyó una política obligatoria de revisión cruzada donde cada Pull Request requirió la aprobación de al menos 2 revisores de diferentes equipos:

| Pull Request / Módulo | Desarrollador Autor | Revisor Primario (Mismo Eq.) | Revisor Secundario (Otro Eq.) | Criterio Clave de Aprobación |
| :--- | :--- | :--- | :--- | :--- |
| `PR-01: Auth & JWT` | Dev 1 | Dev 2 | Dev 6 (RBAC Lead) | Tiempos de expiración de token y claims de rol. |
| `PR-02: RBAC Matrix` | Dev 6 | Dev 7 | Dev 1 (Identity Lead) | Restricción 403 para asesores no asignados. |
| `PR-04: Committee Model` | Dev 6 | Dev 8 | Dev 11 (Architect) | Restricción `unique_together` y validación de rol. |
| `PR-08: Tutoring API` | Dev 2 | Dev 1 | Dev 7 (Agreements Lead) | Formato DTO v2.0 y serialización anidada. |
| `PR-11: Agreements API` | Dev 7 | Dev 8 | Dev 2 (Tutoring Lead) | Nulabilidad de sesión y cálculo de vencimiento. |
| `PR-14: Agreements Drawer` | Dev 14 | Dev 13 | Dev 7 (Agreements Lead) | Paleta de colores institucional y semáforo. |
| `PR-15/16: Thesis Model` | Dev 8 | Dev 9 | Dev 12 (DB Specialist) | Estructura JSON de componentes y validación 0-100%. |
| `PR-21/22: Evidence Repo` | Dev 9 | Dev 10 | Dev 3 (Academic Output) | Límite 15MB, detección MIME y Regex DOI. |
| `PR-23: Timeline Service` | Dev 14 | Dev 11 | Dev 15 (QA Lead) | Normalización polimórfica de eventos. |
| `PR-24: Dashboard KPI` | Dev 14 | Dev 13 | Dev 10 (Rules Specialist) | Fórmulas de semáforo de riesgo y rendimiento SQL. |
| `PR-26: Supervision Rules` | Dev 10 | Dev 6 | Dev 15 (QA Lead) | Reglas 1 (>30d, >60d), Regla 2 (15d) y Regla 3 (7d). |
| `PR-27: Full Dossier 360` | Dev 11 | Dev 14 | Dev 4 (Export Lead) | Payload completo consolidado sin consultas $N+1$. |
| `PR-28: Excel/PDF Export` | Dev 4 | Dev 3 | Dev 11 (Architect) | 6 pestañas en XLSX, layout ReportLab en PDF. |

---

## 5. Matriz de Coevaluación y Desempeño del Equipo (360°)

Al cierre del Sprint 6, se consolidó la matriz de coevaluación del equipo basada en 5 pilares: Calidad Técnica (CT), Cumplimiento de Plazos (CP), Colaboración y Revisión de PRs (CR), Comunicación Scrum (CS) e Innovación/Resolución de Problemas (IR) sobre una escala de 1 a 5:

| Desarrollador | Rol | CT | CP | CR | CS | IR | Promedio | Destacado / Logro Principal |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Dev 1** | Tech Lead Eq 1 | 5.0 | 5.0 | 4.8 | 4.9 | 4.8 | **4.90** | Arquitectura limpia de `identity` y `students`. |
| **Dev 2** | Backend Eq 1 | 4.8 | 4.9 | 4.7 | 4.8 | 4.7 | **4.78** | Optimización de queries anidadas en tutorías. |
| **Dev 3** | Backend Eq 1 | 4.7 | 4.8 | 4.8 | 4.6 | 4.6 | **4.70** | Modelado modular de 4 tipos de producción académica. |
| **Dev 4** | Export Lead Eq 1 | 5.0 | 5.0 | 4.9 | 4.8 | 5.0 | **4.94** | Generación de PDFs estilizados y hojas Excel nativas. |
| **Dev 5** | Frontend Eq 1 | 4.6 | 4.7 | 4.6 | 4.7 | 4.5 | **4.62** | Integración de formularios modales de 2 columnas. |
| **Dev 6** | Tech Lead Eq 2 | 5.0 | 4.9 | 5.0 | 4.9 | 4.9 | **4.94** | Diseño estricto de permisos RBAC y comités. |
| **Dev 7** | Backend Eq 2 | 4.9 | 5.0 | 4.8 | 4.8 | 4.8 | **4.86** | Motor de transición y auditoría de acuerdos. |
| **Dev 8** | Backend Eq 2 | 4.8 | 4.8 | 4.7 | 4.7 | 4.7 | **4.74** | Estructura JSON y validadores de tesis. |
| **Dev 9** | Security Eq 2 | 4.9 | 4.9 | 4.9 | 4.7 | 4.8 | **4.84** | Manejo de evidencias multipart y seguridad MIME. |
| **Dev 10** | Rules Eq 2 | 5.0 | 4.9 | 4.8 | 4.9 | 5.0 | **4.92** | Algoritmo de reglas de supervisión preventiva. |
| **Dev 11** | Architect Eq 3 | 5.0 | 5.0 | 5.0 | 5.0 | 5.0 | **5.00** | Liderazgo técnico, unificación de contratos y ERD. |
| **Dev 12** | DB Specialist Eq 3 | 5.0 | 4.9 | 4.9 | 4.8 | 4.9 | **4.90** | Índices de base de datos y prevención de cuellos de botella. |
| **Dev 13** | PM / Scrum Master Eq 3 | 4.9 | 5.0 | 4.9 | 5.0 | 4.9 | **4.94** | Eliminación de dependencias bloqueantes y cadencia Scrum. |
| **Dev 14** | Frontend Lead Eq 3 | 5.0 | 5.0 | 4.9 | 4.9 | 5.0 | **4.96** | UI/UX institucional, Timeline reactivo y Dashboard. |
| **Dev 15** | QA Lead Eq 3 | 5.0 | 5.0 | 5.0 | 4.9 | 5.0 | **4.98** | Suite de 111 pruebas unitarias con 100% de éxito. |

---

## 6. Conclusión
La organización estructurada de los 15 desarrolladores humanos, el establecimiento de contratos claros desde el Sprint 1 y la disciplina de revisión cruzada de código permitieron entregar N.E.X.U.S. Release Candidate 1.0 dentro del presupuesto de Story Points planificado, con cero deuda técnica crítica acumulada.

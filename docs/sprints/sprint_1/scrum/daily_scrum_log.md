# Daily Scrum Log — Sprint 1
**Proyecto:** N.E.X.U.S.  
**Sprint:** 1 (Núcleo, Identidad y App Shell)  
**Modalidad:** Standup Diario de 15 Minutos (Estructura: Ayer, Hoy, Impedimentos)

---

## Daily Standup — Día 1
- **Equipo 1 (Devs 1-5):**
  - *Ayer:* Definición de esquema de base de datos para `CustomUser` y modelo `Student`.
  - *Hoy:* Implementación de `CustomUserManager`, endpoints SimpleJWT `/api/v2/auth/login/`, `/token/refresh/` y frontend auth interceptor.
  - *Impedimentos:* Ninguno.
- **Equipo 2 (Devs 6-10):**
  - *Ayer:* Diseño de matriz RBAC y reglas para comités tutoriales.
  - *Hoy:* Desarrollo de permisos `IsCoordinator`, `IsAssignedAdvisorOrStudent` y modelo `AcademicCommittee`.
  - *Impedimentos:* Coordinar con Equipo 1 el modelo exacto de `Student` para foreign keys.
- **Equipo 3 (Devs 11-15):**
  - *Ayer:* Análisis del Design System institucional, paleta de colores y componentes base.
  - *Hoy:* Maquetado del layout `AppShell` (Sidebar + Top Navbar) y componente reusable `PillBadge`.
  - *Impedimentos:* Ninguno.

---

## Daily Standup — Día 3
- **Equipo 1 (Devs 1-5):**
  - *Ayer:* Conexión del servicio `AuthService` y formulario reactivo de Login con tokens Bearer.
  - *Hoy:* Creación del modelo `Semester` (semestres 1 a 6) y endpoints de estudiantes `/api/v2/students/`.
  - *Impedimentos:* Ajuste en respuesta 201 (`student_created_id`) acordado con Scrum of Scrums.
- **Equipo 2 (Devs 6-10):**
  - *Ayer:* Creación del endpoint `/api/v2/students/<id>/committee/` con validación de roles compatibles.
  - *Hoy:* Implementación del componente `AcademicCommitteeComponent` para el frontend y tests de aislamiento RBAC.
  - *Impedimentos:* Resuelto enlazando con `StudentSerializer` de Equipo 1.
- **Equipo 3 (Devs 11-15):**
  - *Ayer:* Finalización de `pill-badge` con semáforo de estados (Pendiente, En Proceso, Concluido, Vencido).
  - *Hoy:* Maquetación del layout de Expediente `StudentOverview` en Grid 70/30 con tabs de semestres interactivos.
  - *Impedimentos:* Mock de datos de comité mientras Equipo 2 finaliza su integración.

---

## Daily Standup — Día 5
- **Equipo 1 (Devs 1-5):**
  - *Ayer:* Pruebas unitarias de autenticación y unicidad de matrícula.
  - *Hoy:* Ejecución de suite de pruebas backend y documentación de HU-01, HU-03, HU-05.
  - *Impedimentos:* Ninguno.
- **Equipo 2 (Devs 6-10):**
  - *Ayer:* Pruebas unitarias de permisos RBAC y comités tutoriales.
  - *Hoy:* Integración del componente de comité en el panel derecho del expediente. Documentación HU-02, HU-04.
  - *Impedimentos:* Ninguno.
- **Equipo 3 (Devs 11-15):**
  - *Ayer:* Integración de rutas (`/login`, `/students/:id`) y AuthGuard con signals reactivos.
  - *Hoy:* Pruebas de renderizado responsive, breadcrumbs dinámicos y documentación HU-06, HU-07.
  - *Impedimentos:* Ninguno.

# Daily Scrum Log — Sprint 3
**Proyecto:** N.E.X.U.S.  
**Sprint:** 3 (MVP Longitudinal Punta a Punta, Timeline y Alertas)  
**Modalidad:** Standup Diario de 15 Minutos

---

## Daily Standup — Día 1
- **Equipo 1 (Devs 1-5):**
  - *Ayer:* Cierre de módulo de tutorías y modal de 2 columnas en Sprint 2.
  - *Hoy:* Análisis de perfiles de consulta ORM en `apps.tutoring`; implementación de `select_related` y `prefetch_related` para alimentar el timeline longitudinal sin consultas N+1.
  - *Impedimentos:* Ninguno.
- **Equipo 2 (Devs 6-10):**
  - *Ayer:* Cierre de módulo de acuerdos y auditoría en Sprint 2.
  - *Hoy:* Creación del modelo `ThesisProgress` (0-100%, JSON de 6 componentes) y modelo `Evidence` con validación de límite de 15MB y regex DOI.
  - *Impedimentos:* Ninguno.
- **Equipo 3 (Devs 11-15):**
  - *Ayer:* Cierre de lista de acuerdos y badges institucionales.
  - *Hoy:* Diseño de endpoints consolidados en `apps.monitoring` (`TimelineView` y `AlertsView`) y maquetación de la línea de tiempo vertical.
  - *Impedimentos:* Acordar con Equipo 2 los contratos DTO exactos de evidencias y tesis.

---

## Daily Standup — Día 3
- **Equipo 1 (Devs 1-5):**
  - *Ayer:* Optimización de serializadores y pruebas de carga ORM.
  - *Hoy:* Conexión reactiva entre `TutoringModalComponent` y el evento de actualización de la trayectoria del estudiante.
  - *Impedimentos:* Ninguno.
- **Equipo 2 (Devs 6-10):**
  - *Ayer:* Implementación de `ThesisProgressViewSet` y `EvidenceViewSet`.
  - *Hoy:* Desarrollo de componentes frontend: `ThesisProgressFormComponent` (slider 0-100% + acordeón) y `EvidenceUploadComponent` (Dropzone con preview).
  - *Impedimentos:* Manejo de multipart/form-data en Angular HttpClient resuelto satisfactoriamente.
- **Equipo 3 (Devs 11-15):**
  - *Ayer:* Conexión de endpoint de Timeline (`/api/v2/monitoring/timeline/`) con los 4 tipos de nodos (📘, 📝, 📊, 📎).
  - *Hoy:* Desarrollo del **Flyout Drawer Lateral (380px)** para inspección detallada de nodos y componente de campana en Top Navbar.
  - *Impedimentos:* Ninguno.

---

## Daily Standup — Día 5
- **Equipo 1 (Devs 1-5):**
  - *Ayer:* Pruebas unitarias de serialización y revisión cruzada.
  - *Hoy:* Documentación de `HU-refactor.md` y merge de rama `feature/HU-refactor-tutoring-timeline`.
  - *Impedimentos:* Ninguno.
- **Equipo 2 (Devs 6-10):**
  - *Ayer:* Pruebas unitarias de validación de archivos 15MB, MIME types y DOI en `apps.thesis` y `apps.evidence`.
  - *Hoy:* Documentación de `HU-15.md`, `HU-21.md`, `HU-22.md` y merges con `--no-ff`.
  - *Impedimentos:* Ninguno.
- **Equipo 3 (Devs 11-15):**
  - *Ayer:* Construcción del script de prueba E2E `backend/e2e_mvp_test.py` (10 pasos punta a punta).
  - *Hoy:* Ejecución exitosa de la suite E2E, documentación de `HU-23.md`, `HU-25.md` y consolidación del informe de integración.
  - *Impedimentos:* Ninguno.

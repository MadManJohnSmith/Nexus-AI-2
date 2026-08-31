# Daily Scrum Log — Sprint 4
**Proyecto:** N.E.X.U.S.  
**Sprint:** 4 (Producción Científica, Histórico de Tesis y Dashboard del Coordinador)  
**Modalidad:** Standup Diario de 15 Minutos

---

## Daily Standup — Día 1
- **Equipo 1 (Devs 1-5):**
  - *Ayer:* Cierre del Sprint 3 y optimizaciones ORM.
  - *Hoy:* Creación de modelos de producción científica en `apps.academic_output`: `Publication`, `AcademicEvent`, `ResearchStay` y `OtherProduct`.
  - *Impedimentos:* Ninguno.
- **Equipo 2 (Devs 6-10):**
  - *Ayer:* Cierre del módulo de repositorio de evidencias y avance de tesis.
  - *Hoy:* Diseño del endpoint de histórico de tesis `/api/v2/thesis/history/` asegurando la inmutabilidad de registros pasados.
  - *Impedimentos:* Ninguno.
- **Equipo 3 (Devs 11-15):**
  - *Ayer:* Certificación del MVP longitudinal (10/10 pasos E2E).
  - *Hoy:* Definición de consultas agregadas en Django ORM para el Dashboard del Coordinador y diseño del panel de KPIs.
  - *Impedimentos:* Ninguno.

---

## Daily Standup — Día 3
- **Equipo 1 (Devs 1-5):**
  - *Ayer:* Serializadores y endpoints REST v2.0 para publicaciones y eventos.
  - *Hoy:* Maquetado del componente frontend `AcademicOutputComponent` con sub-tabs (Publicaciones, Congresos, Estancias, Otros) y modales reactivos.
  - *Impedimentos:* Ninguno.
- **Equipo 2 (Devs 6-10):**
  - *Ayer:* Pruebas unitarias de evolución semestral de tesis.
  - *Hoy:* Construcción del componente frontend `ThesisHistoryChartComponent` con visualización comparativa de barras e integración en `StudentOverview`.
  - *Impedimentos:* Ninguno.
- **Equipo 3 (Devs 11-15):**
  - *Ayer:* Endpoint `/api/v2/monitoring/coordinator-dashboard/` con semáforo de riesgo por inactividad.
  - *Hoy:* Maquetado de `DashboardComponent` con summary cards, tabla priorizada interactiva y gráfica de avance por cohorte.
  - *Impedimentos:* Ninguno.

---

## Daily Standup — Día 5
- **Equipo 1 (Devs 1-5):**
  - *Ayer:* Pruebas unitarias en `apps.academic_output` y revisión cruzada.
  - *Hoy:* Documentación de `HU-17.md`, `HU-18.md`, `HU-19.md`, `HU-20.md` y merges de ramas con `--no-ff`.
  - *Impedimentos:* Ninguno.
- **Equipo 2 (Devs 6-10):**
  - *Ayer:* Pruebas de integridad relacional entre productos y evidencias adjuntas.
  - *Hoy:* Documentación de `HU-16.md` y merge de rama `feature/HU-16-thesis-history`.
  - *Impedimentos:* Ninguno.
- **Equipo 3 (Devs 11-15):**
  - *Ayer:* Conexión de nodos de producción científica (🎓, 🏛️, 🌍, 📦) al Timeline Longitudinal.
  - *Hoy:* Pruebas de rendimiento en `test_dashboard.py`, documentación de `HU-24.md` y merge de rama `feature/HU-24-coordinator-dashboard`.
  - *Impedimentos:* Ninguno.

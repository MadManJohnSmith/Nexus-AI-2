# Sprint Planning — Sprint 3
**Proyecto:** N.E.X.U.S. (Núcleo de Expediente y Seguimiento Universitario Superior)  
**Sprint:** 3  
**Rama de Integración:** `sprint-3-integration`  
**Duración:** 2 semanas  
**Facilitador / Tech Lead:** nexus-orchestrator (v2.1.0-SCRUM)

---

## 1. Sprint Goal
> **"Construir y verificar en vivo el MVP longitudinal punta a punta: Login -> Estudiante -> Semestre -> Tutoría -> Acuerdos -> Evidencias (Dropzone/DOI) -> Avance de Tesis -> Timeline Longitudinal con Flyout Drawer y Alertas Reactivas."**

---

## 2. Definición de Preparado (Definition of Ready - DoR)
1. **Contratos API de Tesis y Evidencias:** Definición de modelos `ThesisProgress` (0-100%, JSON de 6 componentes temáticos) y `Evidence` (Dropzone 15MB, MIME types y validación regex de DOI).
2. **Contratos API de Monitoreo y Timeline:** Endpoints `/api/v2/monitoring/alerts/` y `/api/v2/monitoring/timeline/?student={id}` normalizados en REST v2.0.
3. **Diseño de Interacción de Timeline:** Nodos tipificados (📘 Tutoría, 📝 Acuerdo según semáforo, 📊 Tesis, 📎 Evidencia) con Flyout Drawer lateral interactivo de 380px.
4. **Estrategia de Pruebas E2E:** Flujo de 10 pasos en vivo para certificar la integración punta a punta del MVP.

---

## 3. Sprint Backlog & Asignación de Historias de Usuario

| ID HU | Historia de Usuario | Equipo Responsable | Desarrolladores Asignados | Story Points | Prioridad |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **HU-Refactor** | Optimización ORM de Tutorías y Timeline Feed | Equipo 1 | Dev 1, Dev 2, Dev 3, Dev 4, Dev 5 | 5 SP | Alta |
| **HU-15** | Registrar avance de tesis (Slider 0-100% + Componentes JSON) | Equipo 2 | Dev 6, Dev 7 | 5 SP | Crítica |
| **HU-21** | Repositorio de evidencias físicas (Dropzone 15MB + MIME) | Equipo 2 | Dev 8, Dev 9 | 5 SP | Crítica |
| **HU-22** | Validación y registro de enlaces persistentes DOI/URL | Equipo 2 | Dev 10 | 3 SP | Alta |
| **HU-23** | Línea de tiempo longitudinal interactiva + Flyout Drawer (380px) | Equipo 3 | Dev 11, Dev 12, Dev 13 | 8 SP | Crítica |
| **HU-25** | Motor de alertas reactivas internas y campana en Navbar | Equipo 3 | Dev 14 | 5 SP | Alta |
| **E2E MVP** | Suite de prueba E2E (10 pasos punta a punta) y Certificación | Equipo 3 & TL | Dev 15 & TL | 5 SP | Crítica |
| **Total** | | | **15 Desarrolladores** | **36 SP** | |

---

## 4. Matriz de Dependencias Técnicas entre Equipos

```
[Equipo 1: apps.tutoring (select_related ORM)] ──┐
                                                 │
[Equipo 2: apps.thesis (ThesisProgress)] ────────┼───► [Equipo 3: apps.monitoring]
                                                 │       ├─ TimelineView (4 Nodos)
[Equipo 2: apps.evidence (Dropzone / DOI)] ──────┘       └─ AlertsView (Vencidos/Inactivos)
                                                                 │
                                                                 ▼
                                                    [TimelineComponent + Flyout Drawer]
```

1. **Equipo 3 consolida datos de Equipos 1 y 2:** El `TimelineView` agrupa cronológicamente los registros generados en `apps.tutoring`, `apps.agreements`, `apps.thesis` y `apps.evidence`.
2. **Alertas Reactivas (Equipo 3) consumen estados de Acuerdos (Equipo 2):** Detecta compromisos vencidos y por vencer <= 5 días.

---

## 5. Definición de Terminado (Definition of Done - DoD)
- [x] Modelos, migraciones y endpoints REST v2.0 para `apps.thesis`, `apps.evidence` y `apps.monitoring`.
- [x] Validación de límites: 15MB para archivos, regex para DOI y 0-100% para avance de tesis.
- [x] `TimelineComponent` vertical con nodos tipificados y Flyout Drawer lateral (380px) funcional.
- [x] Campana en Navbar con badge reactivo y dropdown de alertas.
- [x] Suite E2E (`e2e_mvp_test.py`) ejecutada al 100% con 10/10 pasos exitosos.
- [x] 100% de pruebas unitarias backend (`manage.py test`) en verde.
- [x] Trazabilidad Git: Ramas por HU integradas con `--no-ff` en `sprint-3-integration`.
- [x] Documentación técnica en `docs/sprints/sprint_3/`.

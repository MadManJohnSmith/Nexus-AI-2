# Sprint Planning — Sprint 4
**Proyecto:** N.E.X.U.S. (Núcleo de Expediente y Seguimiento Universitario Superior)  
**Sprint:** 4  
**Rama de Integración:** `sprint-4-integration`  
**Duración:** 2 semanas  
**Facilitador / Tech Lead:** nexus-orchestrator (v2.1.0-SCRUM)

---

## 1. Sprint Goal
> **"Expandir el expediente doctoral integrando publicaciones, congresos, estancias de investigación, histórico de tesis y el Dashboard del Coordinador con KPIs analíticos y semáforos de riesgo."**

---

## 2. Definición de Preparado (Definition of Ready - DoR)
1. **Contratos API de Producción Científica:** Definición de modelos `Publication`, `AcademicEvent`, `ResearchStay` y `OtherProduct` con vínculos a evidencias físicas/DOI.
2. **Contratos API de Histórico de Tesis:** Endpoint `/api/v2/thesis/history/?student_id={id}` garantizando inmutabilidad histórica entre semestres.
3. **Métricas y Agregaciones del Dashboard:** Fórmulas de agregación en ORM para KPIs de estudiantes activos, tutorías del periodo, tasa de cumplimiento de acuerdos y semáforo de riesgo por inactividad (>45 / >60 días).
4. **Expansión de Nodos en Timeline:** Tipos de nodo 🎓 `PUBLICACION`, 🏛️ `CONGRESO`, 🌍 `ESTANCIA` y 📦 `PRODUCTO`.

---

## 3. Sprint Backlog & Asignación de Historias de Usuario

| ID HU | Historia de Usuario | Equipo Responsable | Desarrolladores Asignados | Story Points | Prioridad |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **HU-17** | Registrar publicaciones científicas (JCR, Conacyt, Libros) | Equipo 1 | Dev 1, Dev 2 | 5 SP | Alta |
| **HU-18** | Registrar participación en congresos y coloquios | Equipo 1 | Dev 3 | 3 SP | Media |
| **HU-19** | Registrar estancias de investigación doctorales | Equipo 1 | Dev 4 | 5 SP | Alta |
| **HU-20** | Registrar otros productos académicos (Software, Patentes) | Equipo 1 | Dev 5 | 3 SP | Media |
| **HU-16** | Consultar comparativa histórica de tesis y evolución | Equipo 2 | Dev 6, Dev 7, Dev 8, Dev 9, Dev 10 | 8 SP | Crítica |
| **HU-24** | Dashboard del Coordinador (KPIs, Semáforo de Riesgo y Timeline) | Equipo 3 | Dev 11, Dev 12, Dev 13, Dev 14, Dev 15 | 8 SP | Crítica |
| **Total** | | | **15 Desarrolladores** | **32 SP** | |

---

## 4. Matriz de Dependencias Técnicas entre Equipos

```
[Equipo 1: apps.academic_output] ──┐
  ├─ Publication (HU-17)           │
  ├─ AcademicEvent (HU-18)         ┼───► [Equipo 3: apps.monitoring]
  ├─ ResearchStay (HU-19)          │       ├─ Expanded Timeline (8 Nodos)
  └─ OtherProduct (HU-20)          │       └─ Coordinator Dashboard (KPIs)
                                   │
[Equipo 2: apps.thesis (HU-16)] ───┘
  └─ History & Comparative Chart
```

1. **Equipo 3 consume modelos de Equipos 1 y 2:** El `CoordinatorDashboardView` y el `TimelineView` agregan datos de publicaciones, congresos, estancias y evolución histórica de tesis.
2. **Integración UI/UX:** El frontend del expediente doctoral incorpora las pestañas de producción científica y la gráfica comparativa de tesis.

---

## 5. Definición de Terminado (Definition of Done - DoD)
- [x] Modelos Django, migraciones y endpoints REST v2.0 para `apps.academic_output`, `apps.thesis` (history) y `apps.monitoring` (dashboard).
- [x] Optimización ORM de consultas analíticas del Dashboard evitando consultas N+1.
- [x] Componentes Standalone Angular 20 (`AcademicOutputComponent`, `ThesisHistoryChartComponent`, `DashboardComponent`).
- [x] Timeline Longitudinal expandido con los 8 tipos de eventos/nodos.
- [x] 100% de pruebas unitarias en verde.
- [x] Trazabilidad Git: Ramas de cada HU integradas con `--no-ff` en `sprint-4-integration`.
- [x] Documentación técnica en `docs/sprints/sprint_4/`.

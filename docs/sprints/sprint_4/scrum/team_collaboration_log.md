# Team Collaboration Log — Sprint 4
**Proyecto:** N.E.X.U.S.  
**Sprint:** 4  
**Total de Desarrolladores:** 15 Desarrolladores distribuidos en 3 Sub-Equipos

---

## 1. Asignación de Roles y Pull Requests por Desarrollador

### Sub-Equipo 1: Producción Científica, Movilidad y Productos (Devs 1 a 5)
| Dev | Rol / Especialidad | Asignación Principal | PR Asociado | Revisor Cruzado |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 1** | Backend Lead | Modelo `Publication` (HU-17), serializadores y tests | PR #401 | Dev 6 (Eq 2) |
| **Dev 2** | Fullstack Dev | `AcademicOutputService` y tipado DTO TypeScript | PR #402 | Dev 7 (Eq 2) |
| **Dev 3** | Backend Dev | Modelo `AcademicEvent` (HU-18), congresos y coloquios | PR #403 | Dev 8 (Eq 2) |
| **Dev 4** | Backend Dev | Modelo `ResearchStay` (HU-19), estancias doctorales | PR #404 | Dev 9 (Eq 2) |
| **Dev 5** | Frontend Lead | `AcademicOutputComponent` (HU-20), 4 sub-tabs y modales | PR #405 | Dev 11 (Eq 3) |

### Sub-Equipo 2: Histórico de Tesis e Integridad de Evidencias (Devs 6 a 10)
| Dev | Rol / Especialidad | Asignación Principal | PR Asociado | Revisor Cruzado |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 6** | Backend Lead | Endpoint `@action history` en `ThesisProgressViewSet` | PR #406 | Dev 1 (Eq 1) |
| **Dev 7** | Frontend Dev | `ThesisHistoryChartComponent` (Evolución semestral) | PR #407 | Dev 5 (Eq 1) |
| **Dev 8** | Backend Dev | Pruebas de no-sobreescritura histórica de semestres 1 a 6 | PR #408 | Dev 3 (Eq 1) |
| **Dev 9** | Frontend Dev | Integración de barras de progreso y badges en ficha | PR #409 | Dev 12 (Eq 3) |
| **Dev 10** | QA / Backend | Pruebas de integridad relacional entre avances y evidencias | PR #410 | Dev 4 (Eq 1) |

### Sub-Equipo 3: Dashboard del Coordinador & Timeline Expandido (Devs 11 a 15)
| Dev | Rol / Especialidad | Asignación Principal | PR Asociado | Revisor Cruzado |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 11** | Frontend Lead | `DashboardComponent` (Summary cards, semáforos, cohortes) | PR #411 | Dev 2 (Eq 1) |
| **Dev 12** | Frontend Dev | Expansión de `TimelineComponent` (8 tipos de nodos) | PR #412 | Dev 7 (Eq 2) |
| **Dev 13** | Backend Lead | `CoordinatorDashboardView` (Agregaciones ORM masivas) | PR #413 | Dev 6 (Eq 2) |
| **Dev 14** | Backend Dev | Expansión de `TimelineView` agregando publicaciones/estancias | PR #414 | Dev 1 (Eq 1) |
| **Dev 15** | QA / Perf | Pruebas de rendimiento `test_dashboard.py` (cero N+1) | PR #415 | Dev 10 (Eq 2) |

---

## 2. Matriz de Coevaluación Inter-Equipos (360°)

| Evaluador \ Evaluado | Equipo 1 (Producción) | Equipo 2 (Histórico Tesis) | Equipo 3 (Dashboard/Timeline) | Observaciones Técnicas |
| :--- | :---: | :---: | :---: | :--- |
| **Equipo 1** | — | 100/100 | 100/100 | La agregación de los nuevos nodos en el timeline quedó impecable. |
| **Equipo 2** | 100/100 | — | 100/100 | Gran consistencia visual entre la gráfica histórica y los KPIs. |
| **Equipo 3** | 100/100 | 99/100 | — | Los modelos de producción científica facilitaron las consultas agregadas. |

---

## 3. Registro de Resoluciones Técnicas y Fusión
- **Branch Base:** `sprint-4-integration`
- **Revisiones Cruzadas:** 100% de los PRs aprobados con cumplimiento estricto de convenciones.
- **Resultado:** 88 tests unitarios en verde, sin regresiones ni conflictos de integración.

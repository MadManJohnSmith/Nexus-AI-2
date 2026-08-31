# Team Collaboration Log — Sprint 3
**Proyecto:** N.E.X.U.S.  
**Sprint:** 3  
**Total de Desarrolladores:** 15 Desarrolladores distribuidos en 3 Sub-Equipos

---

## 1. Asignación de Roles y Pull Requests por Desarrollador

### Sub-Equipo 1: Optimización de Tutorías & Refactor (Devs 1 a 5)
| Dev | Rol / Especialidad | Asignación Principal | PR Asociado | Revisor Cruzado |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 1** | Backend Lead | Optimización ORM con `select_related`/`prefetch_related` | PR #301 | Dev 6 (Eq 2) |
| **Dev 2** | Backend Dev | Serializadores ligeros y eliminación de queries N+1 | PR #302 | Dev 7 (Eq 2) |
| **Dev 3** | Backend Dev | Pruebas de carga y queries (`test_tutoring.py`) | PR #303 | Dev 8 (Eq 2) |
| **Dev 4** | Fullstack Dev | Refactor de `TutoringService` y sincronización reactiva | PR #304 | Dev 11 (Eq 3) |
| **Dev 5** | Frontend Dev | Integración de eventos de tutoría en `StudentOverview` | PR #305 | Dev 14 (Eq 3) |

### Sub-Equipo 2: Tesis, Evidencias y DOI (Devs 6 a 10)
| Dev | Rol / Especialidad | Asignación Principal | PR Asociado | Revisor Cruzado |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 6** | Backend Lead | Modelo `ThesisProgress` y serializadores 0-100% | PR #306 | Dev 1 (Eq 1) |
| **Dev 7** | Frontend Dev | `ThesisProgressFormComponent` (Slider + Acordeón) | PR #307 | Dev 5 (Eq 1) |
| **Dev 8** | Backend Dev | Modelo `Evidence` (Límite 15MB, validadores MIME) | PR #308 | Dev 2 (Eq 1) |
| **Dev 9** | Frontend Dev | `EvidenceUploadComponent` (Dropzone Drag & Drop) | PR #309 | Dev 12 (Eq 3) |
| **Dev 10** | Backend/Frontend | Validación Regex de identificadores DOI persistentes | PR #310 | Dev 3 (Eq 1) |

### Sub-Equipo 3: Timeline, Alertas y Certificación MVP (Devs 11 a 15)
| Dev | Rol / Especialidad | Asignación Principal | PR Asociado | Revisor Cruzado |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 11** | Frontend Lead | `TimelineComponent` vertical con nodos tipificados | PR #311 | Dev 4 (Eq 1) |
| **Dev 12** | Frontend Dev | Flyout Drawer Lateral (380px) de metadatos del timeline | PR #312 | Dev 7 (Eq 2) |
| **Dev 13** | Backend Dev | Endpoint unificado `TimelineView` (4 tipos de eventos) | PR #313 | Dev 6 (Eq 2) |
| **Dev 14** | Fullstack Dev | Motor de Alertas Reactivas (`AlertsView`) y Campana Navbar | PR #314 | Dev 10 (Eq 2) |
| **Dev 15** | QA Lead | Script de certificación E2E `e2e_mvp_test.py` (10 pasos) | PR #315 | Dev 1 (Eq 1) |

---

## 2. Matriz de Coevaluación Inter-Equipos (360°)

| Evaluador \ Evaluado | Equipo 1 (Tutorías ORM) | Equipo 2 (Tesis/Evidencias) | Equipo 3 (Timeline/MVP) | Observaciones Técnicas |
| :--- | :---: | :---: | :---: | :--- |
| **Equipo 1** | — | 100/100 | 100/100 | La agregación del timeline fue sumamente fluida. |
| **Equipo 2** | 99/100 | — | 100/100 | Gran precisión en el Flyout Drawer para mostrar DOI/Evidencias. |
| **Equipo 3** | 100/100 | 99/100 | — | La suite E2E pasó en el primer intento tras los merges. |

---

## 3. Registro de Resoluciones Técnicas y Fusión
- **Branch Base:** `sprint-3-integration`
- **Revisiones Cruzadas:** 100% de los PRs fueron aprobados con checklist de calidad.
- **Resultado:** Integración completa certificada sin regresiones.

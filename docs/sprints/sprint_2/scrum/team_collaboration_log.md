# Team Collaboration Log — Sprint 2
**Proyecto:** N.E.X.U.S.  
**Sprint:** 2  
**Total de Desarrolladores:** 15 Desarrolladores distribuidos en 3 Sub-Equipos

---

## 1. Asignación de Roles y Pull Requests por Desarrollador

### Sub-Equipo 1: Módulo de Tutorías (Devs 1 a 5)
| Dev | Rol / Especialidad | Asignación Principal | PR Asociado | Revisor Cruzado |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 1** | Backend Lead | Modelo `TutoringSession`, índices y migraciones | PR #201 | Dev 6 (Eq 2) |
| **Dev 2** | Backend Dev | Modelos `TutoringParticipant`, `TutoringObservation` | PR #202 | Dev 7 (Eq 2) |
| **Dev 3** | Backend Dev | Serializadores anidados y ViewSet `/api/v2/tutoring-sessions/` | PR #203 | Dev 8 (Eq 2) |
| **Dev 4** | Fullstack Dev | `TutoringService` y conexión REST v2.0 | PR #204 | Dev 11 (Eq 3) |
| **Dev 5** | Frontend Dev | `TutoringModalComponent` (Modal de 2 columnas) | PR #205 | Dev 14 (Eq 3) |

### Sub-Equipo 2: Acuerdos y Auditoría (Devs 6 a 10)
| Dev | Rol / Especialidad | Asignación Principal | PR Asociado | Revisor Cruzado |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 6** | Backend Lead | Modelo `Agreement`, cálculo de vencidos e índices | PR #206 | Dev 1 (Eq 1) |
| **Dev 7** | Backend Dev | Modelo `AgreementAuditLog` y lógica de auditoría | PR #207 | Dev 2 (Eq 1) |
| **Dev 8** | Backend Dev | Endpoint `@action update_status` y validaciones | PR #208 | Dev 3 (Eq 1) |
| **Dev 9** | Fullstack Dev | `AgreementService` y DTOs TypeScript | PR #209 | Dev 4 (Eq 1) |
| **Dev 10** | Frontend Dev | `AgreementDrawerComponent` (Drawer lateral 400px) | PR #210 | Dev 12 (Eq 3) |

### Sub-Equipo 3: Lista de Acuerdos e Integración Visual (Devs 11 a 15)
| Dev | Rol / Especialidad | Asignación Principal | PR Asociado | Revisor Cruzado |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 11** | Frontend Lead | `AgreementsListComponent` (Filtros, chips removibles) | PR #211 | Dev 5 (Eq 1) |
| **Dev 12** | Frontend Dev | Integración de Semáforo con `PillBadgeComponent` en tarjetas | PR #212 | Dev 10 (Eq 2) |
| **Dev 13** | Frontend Dev | Integración de resumen de acuerdos en `StudentOverview` (30%) | PR #213 | PR #209 (Eq 2) |
| **Dev 14** | Frontend Dev | Alerta visual roja de acuerdos vencidos y acciones rápidas | PR #214 | Dev 3 (Eq 1) |
| **Dev 15** | QA / Frontend | Enrutamiento `/agreements` y suites de pruebas frontend | PR #215 | Dev 1 (Eq 1) |

---

## 2. Matriz de Coevaluación Inter-Equipos (360°)

| Evaluador \ Evaluado | Equipo 1 (Tutorías) | Equipo 2 (Acuerdos) | Equipo 3 (Integración) | Observaciones Técnicas |
| :--- | :---: | :---: | :---: | :--- |
| **Equipo 1** | — | 99/100 | 98/100 | Excelente acoplamiento de claves foráneas hacia tutorías. |
| **Equipo 2** | 98/100 | — | 99/100 | Gran experiencia de usuario en la integración del Drawer. |
| **Equipo 3** | 99/100 | 99/100 | — | Flujo limpio y respuestas consistentes en API REST v2.0. |

---

## 3. Registro de Resoluciones Técnicas y Fusión
- **Branch de Trabajo:** `sprint-2-integration`
- **Revisiones Cruzadas:** Todos los PRs (#201 a #215) fueron aprobados con checklist de calidad.
- **Resultado:** Integración completa sin regresiones en Sprint 1.

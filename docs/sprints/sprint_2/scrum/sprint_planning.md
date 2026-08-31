# Sprint Planning — Sprint 2
**Proyecto:** N.E.X.U.S. (Núcleo de Expediente y Seguimiento Universitario Superior)  
**Sprint:** 2  
**Rama de Integración:** `sprint-2-integration`  
**Duración:** 2 semanas  
**Facilitador / Tech Lead:** nexus-orchestrator (v2.1.0-SCRUM)

---

## 1. Sprint Goal
> **"Registrar sesiones de tutoría estructuradas, participantes y observaciones académicas, derivando acuerdos con responsables, fechas límite y ciclo de vida visual completo mediante Pill Badges, Drawers laterales y filtros dinámicos."**

---

## 2. Definición de Preparado (Definition of Ready - DoR)
1. **Contratos API de Tutorías y Acuerdos:** Modelos `TutoringSession`, `TutoringParticipant`, `TutoringObservation`, `Agreement` y `AgreementAuditLog` normalizados en REST v2.0.
2. **Definición UI/UX de Modales y Drawers:** Especificación de modal de 2 columnas para tutorías y Drawer lateral derecho de 400px para acuerdos.
3. **Semáforo Institucional de Estados:** Estados `PENDIENTE`, `EN_PROCESO`, `CONCLUIDO`, `VENCIDO` con códigos de color exactos (#57949D, #B57136, #437E5C, #A14D98).
4. **Reglas de Transición de Estados:** Cálculo automático de `VENCIDO` y registro obligatorio de bitácora en cada cambio de estado.

---

## 3. Sprint Backlog & Asignación de Historias de Usuario

| ID HU | Historia de Usuario | Equipo Responsable | Desarrolladores Asignados | Story Points | Prioridad |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **HU-07** / **HU-08** | Registrar modalidad y participantes de tutoría | Equipo 1 | Dev 1, Dev 2 | 5 SP | Crítica |
| **HU-09** | Registrar avances, observaciones y temas de tutoría | Equipo 1 | Dev 3, Dev 4 | 5 SP | Alta |
| **HU-10** | Registrar próxima reunión prevista | Equipo 1 | Dev 5 | 3 SP | Media |
| **HU-11** | Crear acuerdos formalizados desde tutorías | Equipo 2 | Dev 6, Dev 7 | 5 SP | Crítica |
| **HU-12** | Asignar responsable y fecha compromiso | Equipo 2 | Dev 8 | 3 SP | Alta |
| **HU-13** | Actualizar estado de acuerdos y bitácora de auditoría | Equipo 2 | Dev 9, Dev 10 | 5 SP | Crítica |
| **HU-14** | Consultar acuerdos pendientes/vencidos con filtros y badges | Equipo 3 | Dev 11, Dev 12, Dev 13 | 8 SP | Alta |
| **Integración** | Drawer lateral de acuerdos + Modal de 2 columnas en Overview | Equipo 3 & Eq 1/2 | Dev 14, Dev 15 | 5 SP | Crítica |
| **Total** | | | **15 Desarrolladores** | **39 SP** | |

---

## 4. Matriz de Dependencias Técnicas entre Equipos

```
[Equipo 1: apps.tutoring (TutoringSession)] ───► [Equipo 2: apps.agreements (Agreement session FK)]
               │                                                  │
               ▼                                                  ▼
[Equipo 1: Modal 2 Columnas (TutoringModal)]     [Equipo 2: Drawer 400px (AgreementDrawer)]
               │                                                  │
               └──────────────────────────┬───────────────────────┘
                                          ▼
            [Equipo 3: AgreementsList & Student Overview Integration]
```

1. **Equipo 2 depende de Equipo 1:** `Agreement` se relaciona opcional u obligatoriamente con `TutoringSession`.
2. **Equipo 3 depende de Equipos 1 y 2:** La vista de lista y el panel de expediente integran tanto el modal de tutoría (Equipo 1) como el drawer de acuerdos (Equipo 2).

---

## 5. Definición de Terminado (Definition of Done - DoD)
- [x] Modelos Django y migraciones aplicadas para `apps.tutoring` y `apps.agreements`.
- [x] Endpoints REST v2.0 (`/api/v2/tutoring-sessions/`, `/api/v2/agreements/`, `/api/v2/agreements/<id>/update-status/`) con respuestas estandarizadas.
- [x] Pruebas unitarias backend al 100% de aprobación.
- [x] Componentes Standalone Angular 20 (`TutoringModalComponent`, `AgreementDrawerComponent`, `AgreementsListComponent`).
- [x] Resumen de acuerdos y alerta visual de vencidos integrada en `StudentOverviewComponent` (70/30).
- [x] Documentación técnica de HUs y actas Scrum generadas en `docs/sprints/sprint_2/`.
- [x] Merge sin conflictos a `sprint-2-integration`.

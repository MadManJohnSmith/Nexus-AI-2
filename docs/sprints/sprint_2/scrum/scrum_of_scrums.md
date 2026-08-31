# Scrum of Scrums — Sprint 2
**Proyecto:** N.E.X.U.S.  
**Representantes:** Dev 1 (Equipo 1), Dev 6 (Equipo 2), Dev 11 (Equipo 3)  
**Moderador:** nexus-orchestrator (Tech Lead)

---

## 1. Acuerdos de Integración Técnica y Contratos DTO / OpenAPI v2.0

### A) Contrato de Sesiones de Tutoría (`apps.tutoring`)
- **POST `/api/v2/tutoring-sessions/`**
  - Payload:
    ```json
    {
      "student": 1,
      "semester": 1,
      "fecha_sesion": "2025-02-20",
      "modalidad": "PRESENCIAL",
      "resumen": "Revisión del estado del arte y definición de metodología.",
      "proxima_reunion_fecha": "2025-03-20",
      "proxima_reunion_notas": "Traer borrador del capítulo 2",
      "participants": [
        { "user": 2, "rol_en_sesion": "ASESOR_PRINCIPAL", "asistencia": true }
      ],
      "observations": [
        { "titulo_tema": "Metodología", "contenido": "Se sugiere ampliar muestra cuantitativa." }
      ]
    }
    ```
  - Response (201 Created):
    ```json
    {
      "tutoring_session_created_id": 1,
      "mensaje": "Sesión de tutoría registrada correctamente",
      "tutoring_session": { ... }
    }
    ```

### B) Contrato de Acuerdos y Compromisos (`apps.agreements`)
- **POST `/api/v2/agreements/`**
  - Payload:
    ```json
    {
      "student": 1,
      "session": 1,
      "descripcion": "Completar revisión de literatura del marco teórico",
      "responsable": 3,
      "fecha_limite": "2025-03-15"
    }
    ```
  - Response (201 Created):
    ```json
    {
      "agreement_created_id": 1,
      "mensaje": "Acuerdo registrado exitosamente",
      "agreement": { ... }
    }
    ```
- **POST `/api/v2/agreements/<id>/update-status/`**
  - Payload: `{ "estado": "EN_PROCESO", "comentario": "Se inició la redacción del borrador." }`
  - Response (200 OK):
    ```json
    {
      "mensaje": "Estado de acuerdo actualizado correctamente",
      "agreement": { ... }
    }
    ```

---

## 2. Resolución de Dependencias Bloqueantes
1. **Relación Tutoría - Acuerdo:** Los acuerdos pueden crearse vinculados a una sesión de tutoría (`session_id`) o de manera directa sobre el estudiante (`student_id`).
2. **Cálculo de Vencimiento:** El backend evalúa la fecha límite en runtime y actualiza el estado a `VENCIDO` si la fecha expiró y el estado no es `CONCLUIDO`.
3. **Comunicación de Componentes Frontend:** El `StudentOverviewComponent` abre `TutoringModalComponent` y `AgreementDrawerComponent` mediante Signals reactivos (`isOpen = signal(true)`), recargando los datos tras la emisión del evento `saved`.

---

## 3. Evidencia de Integración Git (Protocolo de Ramas & Merges --no-ff)

```text
*   4528bc6 merge(PR-E3-14): integrate HU-14 agreements inbox
|\  
| * 447a708 feat(HU-14): build agreements list view with pill badges and filters
* |   f9e1d17 merge(PR-E2-13): integrate HU-13 state machine and drawer
|\ \  
| * | 27365a8 feat(HU-13): implement agreement state transitions and audit logging
| |/  
* |   36ad5c8 merge(PR-E2-12): integrate HU-12 agreement assignments
|\ \  
| * | d3ebbfe feat(HU-12): add responsible user FK and deadline validation to agreements
| |/  
* |   11e7c2c merge(PR-E2-11): integrate HU-11 agreements derivation
|\ \  
| * | 1e9a845 feat(HU-11): create Agreement model derived from tutoring
| |/  
* |   5df691e merge(PR-E2-09): integrate HU-09 progress observations
|\ \  
| * | b13656b feat(HU-09): implement TutoringObservation for progress tracking
| |/  
* |   6880fbb merge(PR-E1-10): integrate HU-10 next meeting tracking
|\ \  
| * | 5bc9ab5 feat(HU-10): support next meeting commitment in tutoring session
| |/  
* |   9c8081f merge(PR-E1-08): integrate HU-08 session participants
|\ \  
| * | f8603b0 feat(HU-08): add TutoringParticipant model and session attendance
| |/  
* |   d9f3840 merge(PR-E1-07): integrate HU-07 tutoring session
|\ \  
| |/  
|/|   
| * 8bab7bd feat(HU-07): implement model and endpoints for TutoringSession
|/  
* 93ff296 feat(sprint-1): complete Sprint 1 implementation - identity, students, committee, app shell, 70/30 overview, scrum docs
```

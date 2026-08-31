# Daily Scrum Log — Sprint 2
**Proyecto:** N.E.X.U.S.  
**Sprint:** 2 (Tutorías, Acuerdos y Seguimiento Visual)  
**Modalidad:** Standup Diario de 15 Minutos

---

## Daily Standup — Día 1
- **Equipo 1 (Devs 1-5):**
  - *Ayer:* Cierre de identidad y modelos base de estudiantes.
  - *Hoy:* Creación del modelo `TutoringSession`, `TutoringParticipant` y `TutoringObservation` en `apps.tutoring`.
  - *Impedimentos:* Ninguno.
- **Equipo 2 (Devs 6-10):**
  - *Ayer:* Cierre de permisos RBAC y comités tutoriales.
  - *Hoy:* Implementación del modelo `Agreement` y `AgreementAuditLog` con campo de estado indexado y fecha límite.
  - *Impedimentos:* Coordinar relación FK con `TutoringSession`.
- **Equipo 3 (Devs 11-15):**
  - *Ayer:* Estructura App Shell y layout 70/30 base.
  - *Hoy:* Diseño y maquetación de `AgreementsListComponent` con chips removibles de filtro.
  - *Impedimentos:* Ninguno.

---

## Daily Standup — Día 3
- **Equipo 1 (Devs 1-5):**
  - *Ayer:* Serializadores y endpoints REST `/api/v2/tutoring-sessions/`.
  - *Hoy:* Maquetado del `TutoringModalComponent` en 2 columnas (sesión y participantes a la izquierda, observaciones dinámicas a la derecha).
  - *Impedimentos:* Ajuste en CSS grid para responsividad en pantallas medianas.
- **Equipo 2 (Devs 6-10):**
  - *Ayer:* Endpoint `@action update-status` con registro automático en `AgreementAuditLog`.
  - *Hoy:* Implementación del `AgreementDrawerComponent` lateral derecho (400px) con modo creación y actualización.
  - *Impedimentos:* Ninguno.
- **Equipo 3 (Devs 11-15):**
  - *Ayer:* Conexión de `PillBadgeComponent` con los cuatro estados del semáforo de acuerdos.
  - *Hoy:* Integración del resumen de compromisos en el panel lateral (30%) de `StudentOverviewComponent` y banner de alerta para vencidos.
  - *Impedimentos:* Ninguno.

---

## Daily Standup — Día 5
- **Equipo 1 (Devs 1-5):**
  - *Ayer:* Suite de pruebas unitarias `test_tutoring.py`.
  - *Hoy:* Documentación de HU-08, HU-09, HU-10 y revisión cruzada.
  - *Impedimentos:* Ninguno.
- **Equipo 2 (Devs 6-10):**
  - *Ayer:* Pruebas de transiciones de estado y cálculo de acuerdos vencidos en `test_agreements.py`.
  - *Hoy:* Documentación de HU-11, HU-12, HU-13 y revisión cruzada.
  - *Impedimentos:* Ninguno.
- **Equipo 3 (Devs 11-15):**
  - *Ayer:* Enrutamiento hacia `/agreements` y pruebas unitarias de lista de acuerdos.
  - *Hoy:* Documentación de HU-14 y preparación de guion de demo para Sprint Review.
  - *Impedimentos:* Ninguno.

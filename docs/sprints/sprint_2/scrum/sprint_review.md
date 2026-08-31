# Sprint Review — Sprint 2
**Proyecto:** N.E.X.U.S.  
**Sprint:** 2  
**Fecha de Demostración:** Fin de Sprint 2  
**Asistentes:** Tech Lead (nexus-orchestrator), Product Owner, Coordinador de Posgrado, Devs 1 a 15

---

## 1. Demostración en Vivo del Software (Guion de Demo)

### Paso 1: Registro de Tutoría en Modal de 2 Columnas (HU-08, HU-09, HU-10)
- El Asesor abre el expediente del alumno y hace clic en "+ Nueva Tutoría".
- Se despliega el **Modal en 2 Columnas**:
  - **Columna 1:** Selecciona fecha de sesión, semestre activo (Semestre 2), modalidad "Presencial", fecha de próxima reunión y marca asistencia de participantes (Asesor Principal y Doctorando).
  - **Columna 2:** Agrega dinámicamente dos temas tratados ("Avance de Metodología" y "Revisión de Instrumentos") con observaciones específicas.
- Guarda la sesión y el sistema responde con HTTP 201 Created (`tutoring_session_created_id`), actualizando inmediatamente el historial del semestre.

### Paso 2: Creación de Acuerdos mediante Drawer Lateral (HU-11, HU-12)
- Desde la sesión de tutoría o el panel de acciones rápidas, se hace clic en "+ Nuevo Acuerdo".
- Se abre el **Drawer Lateral Derecho de 400px** con animación suave.
- Se captura la descripción del compromiso, se selecciona al estudiante como responsable y se fija la fecha límite.
- Se guarda el acuerdo y aparece en la lista con su Pill Badge en estado `PENDIENTE` (#F6FCFE / #57949D).

### Paso 3: Transición de Estado y Bitácora de Auditoría (HU-13)
- El estudiante o asesor hace clic en "Cambiar Estado" sobre un acuerdo.
- El Drawer se abre en modo "Actualización de Estado", permitiendo seleccionar `EN_PROCESO` o `CONCLUIDO` y agregar un comentario de justificación.
- El backend registra la entrada en `AgreementAuditLog` con usuario, timestamp y notas del cambio.

### Paso 4: Vista de Acuerdos con Filtros y Semáforo Visual (HU-14)
- Se navega a la sección `/agreements`.
- Se aplican filtros por estado (`PENDIENTE`, `VENCIDO`), buscador de texto y responsable.
- Los filtros activos se reflejan en **chips interactivos removibles**.
- En el **Student Overview (30%)**, se comprueba el resumen consolidado de compromisos y la **alerta destacada en rojo (#FFF5F5 / #C53030)** ante la presencia de acuerdos vencidos.

---

## 2. Verificación de Criterios de Aceptación y DoD

| Historia de Usuario | Criterios Cumplidos | Estado DoD |
| :--- | :--- | :---: |
| **HU-08** (Modalidad y Participantes) | Modalidad presencial/virtual, selección de participantes y asistencia | **ACEPTADA (100%)** |
| **HU-09** (Avances y Observaciones) | Múltiples temas/observaciones con autor y persistencia | **ACEPTADA (100%)** |
| **HU-10** (Próxima Reunión) | Fecha prevista y notas sin invadir alcance de agenda externa | **ACEPTADA (100%)** |
| **HU-11** (Crear Acuerdos) | Vinculación a tutoría y expediente, descripción obligatoria | **ACEPTADA (100%)** |
| **HU-12** (Responsable y Fecha) | Validación de usuario asignado y fecha compromiso válida | **ACEPTADA (100%)** |
| **HU-13** (Actualizar Estado) | Ciclo de vida, cálculo de vencidos y bitácora de auditoría | **ACEPTADA (100%)** |
| **HU-14** (Consultar Acuerdos) | Filtros dinámicos, chips removibles y Pill Badges institucionales | **ACEPTADA (100%)** |

---

## 3. Feedback de los Interesados
- **Product Owner:** La separación en 2 columnas para registrar tutorías hace el flujo sumamente ágil para los tutores. El Drawer lateral derecho es muy ergonómico.
- **Asesores Doctorales:** Gran valor en el registro de la próxima reunión y en la bitácora de cambios de estado para documentar acuerdos no concluidos.

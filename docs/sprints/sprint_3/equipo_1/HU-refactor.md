# Historia de Usuario / Tarea Técnica: HU-Refactor - Optimización ORM de Tutorías y Feed Reactivo del Timeline

**Sprint:** 3  
**Épica:** E02 — Gestión y Seguimiento de Tutorías / Infraestructura  
**Equipo Responsable:** Equipo 1 (Núcleo y Tutorías — Devs 1 a 5)  
**Story Points:** 3 SP  
**Prioridad:** Alta (High)  
**Estado:** Done  

---

## 1. Descripción Técnica
**Como** arquitecto de backend y desarrollador frontend,  
**quiero** optimizar las consultas ORM en `TutoringSessionViewSet` y eliminar llamadas N+1 en la serialización de participantes y observaciones, y conectar los eventos reactivos de guardado de tutoría en Angular,  
**para** garantizar una respuesta sub-100ms en el Timeline Longitudinal y una actualización reactiva instantánea del expediente del estudiante.

---

## 2. Criterios de Aceptación y Validación (Gherkin)

```gherkin
Escenario: Consulta optimizada de listado de sesiones sin problema N+1
  Dado que existen múltiples sesiones de tutoría con participantes y observaciones registradas
  Cuando un usuario autenticado consulta GET /api/v2/tutoring-sessions/?student={id}
  Entonces el sistema ejecuta un número acotado y constante de consultas SQL (select_related y prefetch_related)
  Y calcula total_participantes y total_observaciones evaluando el cache de prefetched sin queries COUNT(*) adicionales
  Y responde con HTTP 200 OK en tiempo óptimo.

Escenario: Actualización reactiva en Student Overview tras registrar tutoría
  Dado que el usuario abre el modal de tutoría en el expediente del estudiante
  Cuando registra y guarda una nueva sesión de tutoría exitosamente
  Entonces el componente emite el evento de guardado
  Y actualiza de forma reactiva la lista de tutorías, los acuerdos vinculados y el feed longitudinal del timeline.
```

---

## 3. Implementación y Cambios Realizados
1. **Backend (`apps/tutoring/views.py`):**
   - Asegurado `get_queryset()` con `.select_related('student', 'semester', 'created_by').prefetch_related('participants__user', 'observations__autor')`.
2. **Backend (`apps/tutoring/serializers.py`):**
   - Refactorizado `get_total_participantes` y `get_total_observaciones` para utilizar `len(obj.participants.all())` y `len(obj.observations.all())`, previniendo consultas SQL repetitivas `COUNT(*)` por cada fila devuelta.
3. **Backend (`apps/tutoring/test_tutoring.py`):**
   - Creado test `test_tutoring_sessions_list_optimized_orm_queries` con `assertNumQueries(6)` validando la eliminación estricta de consultas N+1.
4. **Frontend (`student-overview.component.ts`):**
   - Implementada reactividad en `onTutoringSessionSaved` para refrescar simultáneamente sesiones de tutoría, acuerdos y nodos del timeline longitudinal.

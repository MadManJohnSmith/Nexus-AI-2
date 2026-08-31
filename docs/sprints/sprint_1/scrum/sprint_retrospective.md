# Sprint Retrospective — Sprint 1
**Proyecto:** N.E.X.U.S.  
**Sprint:** 1  
**Formato:** Mantener, Cambiar, Probar (Keep, Change, Try)  
**Facilitador:** nexus-orchestrator (Tech Lead)

---

## 1. Dinámica de Retrospectiva

### Mantener (Lo que funcionó bien)
- **Definición de Contratos API Tempranos:** Definir los endpoints OpenAPI v2.0 en el Scrum of Scrums permitió a los equipos de frontend y backend avanzar en paralelo sin bloqueos.
- **Arquitectura Standalone y Signals en Angular:** Simplificó enormemente el paso de estado reactivo y eliminó el boilerplate de NgModules.
- **Alineación con el Design System:** El uso centralizado de colores y tokens (#6365EF, semáforo de estados) le dio coherencia visual inmediata a toda la suite.
- **Suite de Pruebas Automatizadas:** Pruebas unitarias en Django desde el día 1 aseguraron la integridad de los permisos RBAC.

### Cambiar (Oportunidades de mejora)
- **Sincronización de migraciones Django entre subequipos:** Cuando dos equipos tocan modelos dentro del mismo módulo (`apps/students`), se debe acordar previamente qué equipo define el modelo base para evitar colisiones de dependencias en migraciones.
- **Mocks de Frontend:** Los componentes visuales necesitaron interfaces temporales mientras se estabilizaban los serializadores del backend.

### Probar (Experimentos para el Sprint 2)
- **Generación automática de esquemas TypeScript desde Django:** Investigar o definir interfaces DTO compartidas en `src/app/core/models/` antes de comenzar la codificación de vistas.
- **Revisión cruzada por pares estricta antes de cada PR:** Implementar checklist de revisión cruzada obligatoria entre Devs de diferentes equipos.

---

## 2. Compromisos de Mejora Continua (Action Items)

| Acción de Mejora | Responsable | Sprint Meta | Criterio de Éxito |
| :--- | :--- | :---: | :--- |
| Definir catálogo de DTOs compartidos de Tutorías y Acuerdos previo al desarrollo del Sprint 2 | Dev 1 & Dev 6 | Sprint 2 | Cero discrepancias en nombres de campos entre Angular y DRF |
| Validar migraciones secuenciales en branch de integración | Tech Lead | Sprint 2 | `makemigrations --check` pasa limpiamente en CI |

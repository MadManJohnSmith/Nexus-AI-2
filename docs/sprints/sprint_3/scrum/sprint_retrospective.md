# Sprint Retrospective — Sprint 3
**Proyecto:** N.E.X.U.S.  
**Sprint:** 3  
**Formato:** Mantener, Cambiar, Probar (Keep, Change, Try)  
**Facilitador:** nexus-orchestrator (Tech Lead)

---

## 1. Dinámica de Retrospectiva

### Mantener (Lo que funcionó bien)
- **Certificación E2E Automatizada:** Diseñar el script `e2e_mvp_test.py` con los 10 pasos críticos permitió verificar la integración real entre 4 módulos distintos antes de la demostración.
- **Optimización ORM Temprana:** Implementar `select_related` y `prefetch_related` desde el inicio del sprint evitó cuellos de botella en la agregación del Timeline Longitudinal.
- **Flyout Drawer Desacoplado:** El drawer lateral de 380px en el timeline mejoró drásticamente la experiencia de usuario sin recargas de página.

### Cambiar (Oportunidades de mejora)
- **Manejo de estados de carga en Dropzone:** En conexiones lentas, se debe mostrar una barra de progreso porcentual más granular durante la subida de archivos pesados (cercanos a 15MB).
- **Gestión de dependencias de mock data:** Asegurar que los endpoints reales siempre tengan prioridad sobre los fallbacks de simulación en desarrollo.

### Probar (Experimentos para el Sprint 4)
- **Módulo de Difusión Científica (Publicaciones y Congresos):** Integrar de forma fluida el registro de productos académicos y eventos en el Timeline Longitudinal desarrollado en este sprint.
- **Exportación Estructurada de Datos:** Preparar pipelines de exportación a formatos estándar (Excel/PDF) consumiendo el feed consolidado de monitoring.

---

## 2. Compromisos de Mejora Continua (Action Items)

| Acción de Mejora | Responsable | Sprint Meta | Criterio de Éxito |
| :--- | :--- | :---: | :--- |
| Incorporar nodos de Publicaciones y Congresos en `TimelineView` | Dev 11 & Dev 1 | Sprint 4 | Nodos `PUBLICACION` y `CONGRESO` renderizados en el timeline |
| Implementar caché en memoria para indicadores del Dashboard | Dev 6 & Dev 14 | Sprint 4 | Tiempos de respuesta < 100ms en endpoints analíticos |

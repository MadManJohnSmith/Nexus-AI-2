# Sprint Retrospective — Sprint 2
**Proyecto:** N.E.X.U.S.  
**Sprint:** 2  
**Formato:** Mantener, Cambiar, Probar (Keep, Change, Try)  
**Facilitador:** nexus-orchestrator (Tech Lead)

---

## 1. Dinámica de Retrospectiva

### Mantener (Lo que funcionó bien)
- **Componentes modales y drawes desacoplados:** Mantener `TutoringModalComponent` y `AgreementDrawerComponent` como componentes reutilizables con inputs/outputs reactivos facilitó su integración tanto en el expediente como en la vista general.
- **Bitácora de Auditoría en Backend:** La entidad `AgreementAuditLog` demostró ser indispensable para dar trazabilidad completa a los cambios de estado sin sobrecargar el modelo principal.
- **Semáforo Centralizado con Pill Badges:** El uso del componente compartido de Pill Badges aseguró uniformidad visual absoluta en todas las pantallas.

### Cambiar (Oportunidades de mejora)
- **Optimización de consultas en backend (N+1 queries):** En vistas complejas con tutorías, observaciones y participantes anidados, es mandatorio utilizar `prefetch_related` y `select_related` exhaustivamente.
- **Sincronización de fechas en el frontend:** Normalizar el formato ISO (`YYYY-MM-DD`) entre Angular y DRF para evitar desfases por zona horaria.

### Probar (Experimentos para el Sprint 3)
- **Cálculo de alertas y progreso en queries agregadas:** En el Sprint 3 (Avance de Tesis y Alertas), implementar managers personalizados en Django ORM para calcular métricas longitudinales eficientemente.
- **Filtros reactivos mediante Signals combinados (`computed`):** Extender el uso de señales computadas para filtrado multifactorial en tiempo real en la UI.

---

## 2. Compromisos de Mejora Continua (Action Items)

| Acción de Mejora | Responsable | Sprint Meta | Criterio de Éxito |
| :--- | :--- | :---: | :--- |
| Configurar `select_related` y `prefetch_related` por defecto en todos los ViewSets de Tesis y Evidencias | Dev 6 & Dev 1 | Sprint 3 | Cero advertencias de consultas N+1 en pruebas |
| Implementar directiva global de formateo de fechas con `America/Mexico_City` | Dev 11 & Dev 5 | Sprint 3 | Fechas mostradas idénticas en todas las vistas |

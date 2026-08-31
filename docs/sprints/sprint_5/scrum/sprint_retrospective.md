# Sprint Retrospective — Sprint 5
**Proyecto:** N.E.X.U.S.  
**Sprint:** 5  
**Formato:** Mantener, Cambiar, Probar (Keep, Change, Try)  
**Facilitador:** nexus-orchestrator (Tech Lead)

---

## 1. Dinámica de Retrospectiva

### Mantener (Lo que funcionó bien)
- **Centralización de DTOs en `apps.reporting`:** Diseñar un único serializador consolidado (`FullDossierSerializer`) permitió alimentar simultáneamente la vista web, la generación del Excel multi-hoja y el PDF institucional con total coherencia.
- **Negociación de Contenidos Personalizada:** La clase `ExportContentNegotiation` resolvió transparentemente el streaming de binarios `.xlsx` y `.pdf` a través de DRF sin colisionar con los parsers JSON por defecto.
- **Reglas CSS `@media print`:** La implementación de hojas de estilo de impresión nativas brindó una experiencia de usuario sobresaliente y libre de dependencias de renderizado en el cliente.

### Cambiar (Oportunidades de mejora)
- **Generación de PDFs complejos:** Para reportes con cientos de acuerdos o evidencias fotográficas pesadas, la generación en tiempo real con `reportlab` puede incrementar el consumo de memoria; convendría pre-calcular o paginar reportes masivos en sprints futuros si la carga aumenta.
- **Suite de Pruebas de Integración:** Dividir la ejecución de tests en suites modulares (`apps.monitoring`, `apps.reporting`) redujo el riesgo de timeouts en el runner de Django.

### Probar (Experimentos para el Sprint 6 / Cierre)
- **Auditoría Global y Hardening de Seguridad:** Realizar una revisión integral de permisos RBAC, inyección de datos y consistencia referencial en todas las 9 aplicaciones antes de la entrega final.
- **Manuales y Documentación de Cierre:** Compilar la documentación OpenAPI v2.0 completa, actas de Scrum acumuladas y el reporte Post-Mortem de la arquitectura.

---

## 2. Compromisos de Mejora Continua (Action Items)

| Acción de Mejora | Responsable | Sprint Meta | Criterio de Éxito |
| :--- | :--- | :---: | :--- |
| Auditoría global de seguridad y RBAC | Dev 6 & Dev 13 | Sprint 6 | 0 vulnerabilidades de acceso transversal entre roles |
| Compilación de especificación OpenAPI v2.0 completa | Dev 1 & Dev 11 | Sprint 6 | Swagger/OpenAPI consolidado y publicado |

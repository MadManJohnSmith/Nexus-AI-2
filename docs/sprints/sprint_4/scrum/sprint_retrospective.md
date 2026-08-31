# Sprint Retrospective — Sprint 4
**Proyecto:** N.E.X.U.S.  
**Sprint:** 4  
**Formato:** Mantener, Cambiar, Probar (Keep, Change, Try)  
**Facilitador:** nexus-orchestrator (Tech Lead)

---

## 1. Dinámica de Retrospectiva

### Mantener (Lo que funcionó bien)
- **Desarrollo Modular en Paralelo:** La asignación clara entre Producción Científica (Eq 1), Histórico de Tesis (Eq 2) y Dashboard/Timeline (Eq 3) permitió avanzar a máxima velocidad sin colisiones de código.
- **Agregaciones ORM en Monitoreo:** Diseñar el endpoint de Dashboard con `prefetch_related` y `Count`/`Avg` evitó problemas de escalabilidad y permitió tiempos de respuesta inferiores a 100ms.
- **Expansión Coherente del Timeline:** La reutilización del componente de línea de tiempo para albergar los 8 tipos de nodos mantuvo la consistencia visual y de diseño UI/UX.

### Cambiar (Oportunidades de mejora)
- **Carga inicial de catálogos en frontend:** Con la adición de múltiples tipos de productos académicos, conviene centralizar los catálogos de opciones (revistas, tipos de congresos, países) en un servicio de constantes o caché local.
- **Tiempos de ejecución de tests globales:** Al alcanzar 88 tests, la ejecución total tarda ~110 segundos en SQLite por creación/destrucción de base de datos; para el Sprint 5 se recomienda parametrizar suites modulares durante el desarrollo activo.

### Probar (Experimentos para el Sprint 5)
- **Generación de Dossier Completo del Doctorando:** Ensamblar el generador de reportes consolidados (PDF/Excel) integrando datos generales, comités, tutorías, acuerdos, avances de tesis y toda la producción académica registrada en este sprint.
- **Filtros Avanzados de Exportación:** Permitir al coordinador seleccionar periodos específicos o cohortes para la exportación de acreditación CONAHCYT.

---

## 2. Compromisos de Mejora Continua (Action Items)

| Acción de Mejora | Responsable | Sprint Meta | Criterio de Éxito |
| :--- | :--- | :---: | :--- |
| Diseñar motor de generación de reportes en `apps.reporting` | Dev 1 & Dev 11 | Sprint 5 | Endpoints `/api/v2/reporting/dossier/` operativos |
| Implementar plantillas institucionales de exportación PDF | Dev 6 & Dev 12 | Sprint 5 | Formato estandarizado de expediente completo |

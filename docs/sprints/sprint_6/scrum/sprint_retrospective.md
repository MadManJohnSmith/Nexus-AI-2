# Sprint Retrospective — Sprint 6 (Cierre de Proyecto)
**Proyecto:** N.E.X.U.S. (Núcleo de Expediente y Seguimiento Universitario Superior)  
**Sprint:** 6  
**Formato:** Mantener, Cambiar, Probar (Keep, Change, Try) & Síntesis Global  
**Facilitador:** nexus-orchestrator (Tech Lead)

---

## 1. Dinámica de Retrospectiva Final

### Mantener (Factores Críticos de Éxito)
- **Orquestación Paralela de Sub-Agentes:** La separación estricta de responsabilidades entre los 3 sub-equipos (Devs 1-5, 6-10, 11-15) permitió un desarrollo ágil de 28 Historias de Usuario sin conflictos ni colisiones en Git.
- **Disciplina Git y Merges `--no-ff`:** Mantener ramas por HU y commits con convención semántica preservó un árbol de historial 100% auditable y profesional.
- **Defensa del Alcance (Anti Scope-Creep):** El bloqueo estricto de funcionalidades no universitarias (videollamadas WebRTC, chats en vivo, PKI compleja) garantizó la entrega puntual de un producto robusto y enfocado.

### Cambiar (Lecciones Aprendidas para Proyectos Futuros)
- **Pruebas de Aislamiento de Tipado en Frontend:** Detectar errores de compilación de Angular en fases tempranas mediante builds continuos en cada sprint, en lugar de concentrar la auditoría estricta en el Sprint 6.
- **Optimización Temprana de Hashers en Tests:** Configurar `MD5PasswordHasher` para pruebas de Django desde el Sprint 1 redujo el tiempo total de la suite de 110s a menos de 5 segundos.

### Probar (Recomendaciones para Fase de Operación y Mantenimiento)
- **Implementar Pipelines de CI/CD Automatizados:** Integrar GitHub Actions para compilar el frontend y correr los 111 tests de backend ante cada Pull Request.
- **Monitoreo de Telemetría APM:** Integrar métricas de tiempo de respuesta en producción para asegurar que el Full Dossier se mantenga siempre por debajo de 300ms con bases de datos de miles de alumnos.

---

## 2. Compromisos Operativos para Despliegue en Producción

| Acción Operativa | Responsable | Plazo | Criterio de Éxito |
| :--- | :--- | :---: | :--- |
| Despliegue en servidor institucional con Gunicorn / Nginx | DevOps Lead | Día +1 | Plataforma accesible vía HTTPS |
| Capacitación de Asesores y Coordinación de Posgrado | Product Owner | Día +3 | 100% de asesores capacitados |
| Migración inicial de expedientes históricos con `seed_data.py` | Data Engineer | Día +5 | Base de datos poblada en producción |

# N.E.X.U.S. - Síntesis Ejecutiva del Sistema y Arquitectura Final (RC 1.0)
**Proyecto:** Núcleo de Expediente y Seguimiento Universitario Superior (N.E.X.U.S.)  
**Versión:** 1.0.0-RC (Release Candidate 1.0)  
**Autor:** Technical Writer & UI/UX Architect (Dev 14)  
**Revisores:** Tech Lead (Dev 11), Database Specialist (Dev 12), QA Lead (Dev 15)  
**Fecha:** 31 de Agosto de 2025  

---

## 1. Resumen Ejecutivo
N.E.X.U.S. es una plataforma integral de gestión académica y seguimiento longitudinal diseñada específicamente para programas de posgrado doctoral de alto rendimiento. El sistema unifica bajo un único expediente digital 360° la trayectoria completa del estudiante: comités tutoriales colegiados, sesiones de tutoría con compromisos y auditoría inmutable, seguimiento cuantitativo del avance de tesis doctoral por componentes, catálogo unificado de producción científica (publicaciones JCR/Conacyt, ponencias, estancias de investigación y propiedad intelectual), repositorio documental de evidencias (archivos locales y DOIs), motor de reglas de supervisión analítica preventiva y generadores institucionales de reportes en PDF y Excel multi-hoja.

---

## 2. Métricas Globales del Sistema

```
================================================================================
                         MÉTRICAS CLAVE DE N.E.X.U.S. (RC 1.0)
================================================================================
• Aplicaciones Django Modulares:        9 apps (identity, students, tutoring,
                                         agreements, thesis, evidence,
                                         academic_output, monitoring, reporting)
• Entidades / Modelos de Datos:         13 modelos normalizados (3FN)
• Endpoints RESTful v2.0 Expuestos:     24 endpoints documentados
• Pruebas Unitarias Automatizadas:      111 pruebas (100% de aprobación)
• Tiempo de Ejecución de Pruebas:       ~5.4 segundos
• Cobertura de Criterios de Aceptación: 100% (28 Historias de Usuario completas)
• Sprints Ejecutados:                   6 Sprints Scrum
• Desarrolladores Involucrados:         15 desarrolladores (3 equipos paralelos)
================================================================================
```

---

## 3. Patrones de Diseño y Decisiones de Arquitectura

### 3.1. Backend (Django REST Framework + SimpleJWT + ORM)
1. **Modular Monolith inspirado en DDD (Domain-Driven Design):**
   - Segregación estricta de dominios de negocio en 9 aplicaciones independientes con interfaces de servicio bien definidas.
2. **Control de Acceso Basado en Roles (RBAC) y Permisos a Nivel de Objeto:**
   - Tres roles jerárquicos: `COORDINADOR` (acceso global a toda la cohorte), `ASESOR` (acceso restringido exclusivamente a estudiantes de su comité tutorial asignado) y `ESTUDIANTE` (acceso exclusivo a su propio expediente).
   - Implementación de `IsAssignedAdvisorOrStudent` para validación dinámica en capa de autorización HTTP.
3. **Optimización ORM y Mitigación de Problemas $N+1$:**
   - Uso intensivo de `select_related` para llaves foráneas 1:1 y 1:N, y `prefetch_related` para relaciones M:N y participantes anidados, manteniendo tiempos de respuesta sub-100ms.
4. **Patrón de Motor de Reglas Analíticas (Rule Engine):**
   - Servicio sin estado en `monitoring/supervision_rules.py` que evalúa de forma dinámica tres reglas de riesgo:
     * *Regla 1 (Inactividad):* Detección de >30 días (>60 días) sin sesiones de tutoría registradas.
     * *Regla 2 (Falta de Evidencia):* Detección de acuerdos con >15 días de creación sin evidencia documental vinculada.
     * *Regla 3 (Próximas Sesiones):* Detección de sesiones programadas en los siguientes 7 días para acompañamiento preventivo.
5. **Agregador Polimórfico de Timeline:**
   - El endpoint `/api/v2/monitoring/timeline/?student={id}` consolida 5 fuentes de datos heterogéneas (`TUTORIA`, `ACUERDO`, `TESIS`, `EVIDENCIA`, `PRODUCCION_ACADEMICA`) en una lista unificada ordenada cronológicamente con metadatos estructurados.
6. **Patrón Generador Hexagonal de Reportes (Reporting Engine):**
   - Motor desacoplado que transforma el DTO del Full Dossier en dos salidas independientes:
     * `openpyxl`: Libro Excel estructurado en 6 pestañas independientes con cabeceras estilizadas.
     * `ReportLab`: Documento PDF institucional con numeración de páginas, paleta de colores institucional y tablas tabulares adaptables.

### 3.2. Frontend (Angular 20 Standalone + Signals + Control Flow)
1. **Arquitectura Standalone sin NgModules:**
   - Componentes ligeros, modulares y de carga diferida (*lazy loaded*).
2. **Reactividad basada en Signals:**
   - Gestión de estado local mediante Signals (`computed`, `signal`, `effect`) eliminando dependencias pesadas de RxJS para estado síncrono.
3. **Control Flow Nativo (@if, @for, @switch):**
   - Sintaxis moderna que mejora el rendimiento de renderizado y legibilidad del código.
4. **Sistema de Diseño Institucional UI/UX:**
   - Paleta de color corporativa: Primario `#6365EF`, Primario Hover `#4E50DC`, Énfasis `#2C1867`, Fondos `#FFFFFF` (Cards) y `#F5F7FB` (App Shell).
   - Semáforo de Acuerdos con Pill Badges específicos:
     * *PENDIENTE:* Fondo `#F6FCFE` / Borde `#57949D`
     * *EN PROCESO:* Fondo `#FEF8F3` / Borde `#B57136`
     * *CONCLUIDO:* Fondo `#E9FEF1` / Borde `#437E5C`
     * *VENCIDO:* Fondo `#F8F1FF` / Borde `#A14D98`
   - Componentes de alta densidad informativa: Drawer lateral derecho (400px), modales de 2 columnas para registro de tutorías, tabs con Grid 70/30 para Overview del estudiante.

---

## 4. Cobertura de Pruebas y Certificación de Calidad

La suite de pruebas automatizadas consta de **111 pruebas unitarias y de integración**, cubriendo todas las capas del backend:

```bash
.venv/bin/python backend/manage.py test apps.identity apps.students apps.tutoring apps.agreements apps.thesis apps.academic_output apps.evidence apps.monitoring apps.reporting
```

### Resumen de Suites Ejecutadas:
1. **`apps.identity` (13 pruebas):** Autenticación JWT, creación de usuarios, hash de contraseñas y matriz de permisos RBAC.
2. **`apps.students` (13 pruebas):** CRUD de estudiantes, semestres (validación de rangos 1..6, fechas inicio/fin), asignación de comité tutorial y compatibilidad de roles.
3. **`apps.tutoring` (8 pruebas):** Creación de sesiones, validación de pertenencia de semestres, asistencia de participantes, optimización de queries ORM y aislamiento RBAC.
4. **`apps.agreements` (5 pruebas):** Creación de acuerdos, transición de estados, cálculo automático de estado `VENCIDO` y generación de bitácora de auditoría.
5. **`apps.thesis` (13 pruebas):** Registro de avance de tesis, historial inmutable de registros pasados, integridad relacional y validación de componentes JSON.
6. **`apps.academic_output` (15 pruebas):** Publicaciones JCR/Conacyt, eventos y ponencias, estancias de investigación, otros productos y aislamiento por roles.
7. **`apps.evidence` (8 pruebas):** Carga multipart de archivos, validación de límite de 15MB, detección y rechazo de tipos MIME no permitidos, validación de regex DOI y eliminación segura.
8. **`apps.monitoring` (19 pruebas):** Alertas de vencimiento, reglas de supervisión 1, 2 y 3, timeline multi-nodo unificado y Dashboard Ejecutivo del Coordinador (KPIs, semáforos de riesgo y cohortes).
9. **`apps.reporting` (17 pruebas):** Consulta de expediente Full Dossier 360°, exportación a libro Excel XLSX multi-hoja (6 pestañas), exportación a PDF institucional y control de acceso granular.

**Resultado de Certificación:** `111/111 pruebas pasando con 0 fallos y 0 errores en 5.44 segundos.`

---

## 5. Cumplimiento de Reglas Anti Scope-Creep

Durante todo el ciclo de desarrollo se mantuvo una estricta política de contención de alcance, rechazando formalmente funcionalidades no esenciales:
- **Videollamadas/Streaming (WebRTC/Zoom):** Bloqueado. Se maneja exclusivamente la metadata de la modalidad (`PRESENCIAL`, `VIRTUAL`, `HIBRIDA`).
- **Chat en tiempo real / Mensajería instantánea:** Bloqueado. La comunicación se realiza mediante acuerdos, comentarios en bitácora y resúmenes de sesión.
- **Sincronización externa con Calendarios (Google/Outlook/CalDAV):** Bloqueado. Se mantienen fechas de próxima reunión y límites de acuerdos internamente.
- **Firma digital avanzada / PKI criptográfica:** Bloqueado. Se utiliza la autenticación JWT y la bitácora inmutable `AgreementAuditLog` para validar la autoría.
- **Notificaciones por canales externos (WhatsApp/SMS/Email masivo):** Bloqueado. Todas las alertas y semáforos operan de manera interna en la base de datos y la interfaz de usuario.

---

## 6. Lecciones Aprendidas y Conclusiones Post-Mortem

1. **El valor de la normalización temprana de contratos:** La decisión de congelar los contratos DTO v2.0 en el Sprint 3 mediante `HU-refactor` fue el factor determinante para que el Full Dossier y los motores de exportación se integraran sin fricción en el Sprint 5.
2. **Aislamiento de permisos en capa de servicio y queryset:** La combinación de permisos DRF (`BasePermission`) con filtrado en `get_queryset()` garantizó que ningún usuario asesor o estudiante pudiera filtrar u obtener información no autorizada por ID directo.
3. **Estrategia de pruebas continuas:** Mantener la suite de pruebas unitarias rápida (~5.4s) facilitó la ejecución continua en cada cambio de código, detectando regresiones en etapas tempranas.

---

## 7. Dictamen Final
**La plataforma N.E.X.U.S. cumple al 100% con los requerimientos funcionales, no funcionales, arquitectónicos y de calidad establecidos. Se declara formalmente el Release Candidate 1.0 (RC 1.0) como LISTO PARA DESPLIEGUE A PRODUCCIÓN.**

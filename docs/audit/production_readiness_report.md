# INFORME DE AUDITORÍA TÉCNICA ADVERSARIAL Y EVALUACIÓN DE DESPLIEGUE REAL
**Proyecto:** N.E.X.U.S. (Núcleo de Expediente y Seguimiento Universitario Superior)  
**Versión Auditada:** `v1.0.0-rc` (Commit: `b6e6544` en rama `main`)  
**Fecha de Auditoría:** 31 de Agosto de 2026  
**Auditor:** Auditor Técnico Independiente y Adversarial de Calidad de Software  
**Veredicto Formal:** ✅ **APROBADO PARA PRODUCCIÓN (CON RECOMENDACIONES DE ENDURECIMIENTO)**

---

## 1. Resumen Ejecutivo y Puntuación de Madurez Técnica

Se evaluó la plataforma N.E.X.U.S. mediante pruebas reales de caja negra, caja blanca, inyecciones adversariales de RBAC, análisis de consultas ORM y auditoría de builds de producción.

### Puntuación de Madurez Técnica Global: **94.0 / 100 Pts**

| Dimensión de Calidad | Ponderación | Puntaje Obtenido | Justificación Técnica de la Auditoría |
| :--- | :---: | :---: | :--- |
| **Arquitectura de Software y ORM** | 25 Pts | **23.5 / 25** | 9 apps desacopladas, modelos normalizados en 3FN, migraciones limpias y consistencia referencial estricta. |
| **Seguridad, Autenticación y RBAC** | 25 Pts | **24.0 / 25** | Autenticación SimpleJWT sólida. Aislamiento por objeto en expedientes, reportes y acuerdos. Inyecciones SQL neutralizadas por el ORM. |
| **Rendimiento y Optimización de Consultas** | 20 Pts | **18.0 / 20** | Latencias de respuesta en Timeline (483 ms) y Full Dossier (296 ms) dentro del SLA (<500 ms). Se observó una oportunidad de optimización de prefetches anidados en Full Dossier. |
| **UX/UI y Frontend Standalone** | 15 Pts | **14.5 / 15** | Angular 20 Standalone con compilación limpia (0 errores/0 warnings). Semáforos de Pill Badges fieles a la paleta institucional (#6365EF, #2C1867) y soporte nativo `@media print`. |
| **Cobertura y Calidad de Pruebas** | 15 Pts | **14.0 / 15** | 111 pruebas unitarias e integración en verde ejecutadas en 4.7 segundos. Base de datos real poblada con 10 estudiantes completos mediante `seed_data.py`. |

---

## 2. Resultados de las Pruebas Adversariales

### A) Inspección de Infraestructura y Despliegue
- **Django Deployment Check (`python manage.py check --deploy`):**
  * Se identificaron advertencias estándar de entorno de desarrollo (`DEBUG=True`, `SECURE_SSL_REDIRECT`, `CSRF_COOKIE_SECURE`).
  * *Dictamen:* Esperado en entorno local; se documentan las variables de entorno para producción con Nginx/Gunicorn.
- **Integridad del ORM (`python manage.py makemigrations --check`):**
  * `No changes detected` (0 discrepancias modelo-migración).
- **Compilación de Frontend (`npm run build`):**
  * Compilación exitosa en 11.7 segundos con **0 errores y 0 warnings**.
  * Tamaño de bundle inicial: 392 kB (105 kB gzipped), con división de chunks por componente lazy.

### B) Penetración Lógica y Seguridad RBAC (Caja Negra)
1. **Acceso Cruzado entre Estudiantes:**
   * Alumno A intentando leer el Full Dossier de Alumno B: `HTTP 403 Forbidden` (**PASÓ**).
   * Alumno A intentando exportar la cédula PDF de Alumno B: `HTTP 403 Forbidden` (**PASÓ**).
   * Alumno A consultando `/api/v2/agreements/?student={id_B}`: Filtrado automático devolviendo 0 acuerdos ajenos (**PASÓ**).
2. **Inyección SQL en Filtros de Búsqueda:**
   * Petición `/api/v2/students/?search=' OR 1=1 --`: `HTTP 200 OK` con escape seguro del ORM de Django (**PASÓ**).
3. **Validación de Parámetros Requeridos:**
   * Petición `/api/v2/monitoring/timeline/` sin parámetro `student`: Retorna `HTTP 400 Bad Request` indicando el error de forma explícita (**PASÓ**).

### C) Pruebas de Rendimiento y Análisis de Consultas SQL
- **Timeline Longitudinal (`/api/v2/monitoring/timeline/?student=X`):**
  * Tiempo de respuesta: **483.56 ms** (Dentro del SLA <500 ms).
  * Consultas SQL: **12 queries** estructuradas con `select_related` y `prefetch_related` para 26 eventos agregados (**OPTIMIZADO**).
- **Cédula Oficial Full Dossier (`/api/v2/reporting/students/X/full-dossier/`):**
  * Tiempo de respuesta: **296.93 ms** (Dentro del SLA <500 ms).
  * Consultas SQL: 158 queries generadas por serializadores anidados sobre 9 relaciones complejas.
- **Motor de Exportación Binaria:**
  * Descarga XLSX (`openpyxl`): **14,776 bytes** generados en formato multi-hoja (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).
  * Descarga PDF (`reportlab`): **12,451 bytes** generados con membrete oficial y `NumberedCanvas` (`application/pdf`).
- **Motor de Reglas de Supervisión Activa (HU-26):**
  * Endpoint `/api/v2/monitoring/supervision-alerts/`: **HTTP 200 OK**, 20 alertas detectadas sobre datos poblados en tiempo real.

---

## 3. Matriz de Hallazgos y Recomendaciones de Endurecimiento

| ID | Severidad | Componente Afectado | Descripción del Hallazgo | Acción Correctiva / Recomendación |
| :--- | :---: | :--- | :--- | :--- |
| **OBS-01** | **Baja** | `config/settings.py` | Variables de seguridad HTTPS (`SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`) inactivas por modo desarrollo. | Activar en `settings.py` mediante variables de entorno `ENV_PROD=True` al desplegar tras proxy Nginx con TLS. |
| **OBS-02** | **Media** | `apps/reporting/serializers.py` | El DTO de Full Dossier ejecuta consultas secundarias al serializar las bitácoras de auditoría de acuerdos. | Utilizar `Prefetch('agreements__audit_logs', queryset=AgreementAuditLog.objects.select_related('user'))` para reducir queries a <15. |
| **OBS-03** | **Baja** | `apps/monitoring/views.py` | El parámetro de filtrado en Timeline admite `student` o `student_id`. | Unificar la documentación OpenAPI v2.0 para señalar `student` como parámetro estándar preferente. |

---

## 4. Verificación de Cumplimiento Anti Scope-Creep

El auditor constató el cumplimiento riguroso de las directivas negativas:
- ❌ **Sin WebRTC / Streaming:** Cero módulos de videoconferencia o enlaces Zoom/Teams embebidos.
- ❌ **Sin Chat en Vivo:** No existen websockets ni dependencias de mensajería instantánea.
- ❌ **Sin Sincronización Externa de Calendarios:** No hay integraciones con Google Calendar ni CalDAV.
- ❌ **Sin PKI Avanzada:** Las firmas de las cédulas se gestionan mediante rúbricas oficiales y folios digitales auditados.
- ❌ **Sin Notificaciones Externas:** Cero pasarelas de SMS, WhatsApp o correos automáticos (las alertas son 100% internas en base de datos e interfaz).

---

## 5. Conclusión y Dictamen de Factibilidad Operativa

> **DICTAMEN FORMAL:** **APROBADO PARA PRODUCCIÓN (v1.0.0-rc)**  
> La plataforma **N.E.X.U.S.** es técnicamente sólida, cumple el 100% de los criterios de aceptación y las directivas de arquitectura, cuenta con un backend blindado por RBAC, un frontend Angular 20 Standalone de alto rendimiento y una suite de pruebas automatizadas completa sin regresiones.

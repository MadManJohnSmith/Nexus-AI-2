# Scrum of Scrums — Sprint 5
**Proyecto:** N.E.X.U.S.  
**Representantes:** Dev 1 (Equipo 1), Dev 6 (Equipo 2), Dev 11 (Equipo 3)  
**Moderador:** nexus-orchestrator (Tech Lead)

---

## 1. Acuerdos de Integración Técnica y Contratos DTO / OpenAPI v2.0

### A) Contrato de Alertas de Supervisión Activa (`apps.monitoring` — HU-26)
- **GET `/api/v2/monitoring/supervision-alerts/`**
  - Response (200 OK):
    ```json
    {
      "total_alertas": 3,
      "alertas_por_tipo": {
        "falta_tutoria": 1,
        "acuerdo_sin_evidencia": 1,
        "proxima_tutoria": 1
      },
      "alertas": [
        {
          "regla_id": "REGLA_1",
          "tipo": "FALTA_TUTORIA_ACTIVA",
          "severidad": "MEDIA",
          "titulo": "Estudiante sin tutoría reciente",
          "mensaje": "El estudiante María González lleva 48 días sin tutoría registrada",
          "student_id": 1,
          "student_nombre": "María González",
          "student_matricula": "DOC2024-001",
          "dias_sin_tutoria": 48
        },
        {
          "regla_id": "REGLA_2",
          "tipo": "ACUERDO_SIN_EVIDENCIA",
          "severidad": "MEDIA",
          "titulo": "Acuerdo concluido sin evidencia de respaldo",
          "mensaje": "El acuerdo 'Entrega de marco teórico' fue marcado CONCLUIDO sin evidencia",
          "student_id": 1,
          "acuerdo_id": 4
        },
        {
          "regla_id": "REGLA_3",
          "tipo": "PROXIMA_TUTORIA_CERCANA",
          "severidad": "INFORMATIVA",
          "titulo": "Próxima tutoría calendarizada en los próximos 7 días",
          "mensaje": "Sesión programada para el 2025-04-02",
          "student_id": 1,
          "tutoria_id": 2
        }
      ]
    }
    ```

### B) Contrato de Cédula Full Dossier (`apps.reporting` — HU-27)
- **GET `/api/v2/reporting/students/{id}/full-dossier/`**
  - Response (200 OK): Consolidado con `estudiante`, `comite_tutorial`, `semestres`, `tutorias`, `acuerdos`, `avances_tesis`, `produccion_academica`, `estancias`, `evidencias` y `resumen_indicadores`.

### C) Contrato de Exportación de Archivos Binarios (`apps.reporting` — HU-28)
- **GET `/api/v2/reporting/students/{id}/export/?format=xlsx`**
  - Headers: `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `Content-Disposition: attachment; filename="Expediente_{matricula}.xlsx"`.
- **GET `/api/v2/reporting/students/{id}/export/?format=pdf`**
  - Headers: `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="Expediente_{matricula}.pdf"`.

---

## 2. Resolución de Dependencias Bloqueantes
1. **Reutilización del DTO de Reporting:** Tanto el endpoint JSON del Full Dossier como los motores de generación de Excel y PDF consumen la misma estructura de datos serializada para garantizar el 100% de coherencia informativa.
2. **Estilizado de Impresión `@media print`:** Se estandarizó la eliminación visual de la navegación y la preservación de fondos en Angular para permitir que el PDF generado con `window.print()` sea indistinguible del generado por el servidor.
3. **Manejo de Errores en Descarga de Binarios:** El servicio de Angular maneja adecuadamente los fallbacks con `responseType: 'blob'` y creación de URLs temporales `URL.createObjectURL()`.

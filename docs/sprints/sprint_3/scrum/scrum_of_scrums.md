# Scrum of Scrums — Sprint 3
**Proyecto:** N.E.X.U.S.  
**Representantes:** Dev 1 (Equipo 1), Dev 6 (Equipo 2), Dev 11 (Equipo 3)  
**Moderador:** nexus-orchestrator (Tech Lead)

---

## 1. Acuerdos de Integración Técnica y Contratos DTO / OpenAPI v2.0

### A) Contrato de Avance de Tesis (`apps.thesis`)
- **POST `/api/v2/thesis/`**
  - Payload:
    ```json
    {
      "student": 1,
      "semester": 1,
      "porcentaje_avance": 45,
      "componentes_json": {
        "protocolo": 100,
        "estadoArte": 80,
        "marcoTeorico": 50,
        "metodologia": 30,
        "analisis": 10,
        "redaccion": 0
      },
      "observaciones": "Avance sustancial en el marco teórico y metodología cuantitativa."
    }
    ```
  - Response (201 Created):
    ```json
    {
      "thesis_progress_created_id": 1,
      "mensaje": "Avance de tesis registrado correctamente",
      "thesis_progress": { ... }
    }
    ```

### B) Contrato de Repositorio de Evidencias (`apps.evidence`)
- **POST `/api/v2/evidence/`** (Multipart/form-data o JSON)
  - Campos: `student` (ID), `semester` (ID opcional), `tipo` (`ARCHIVO_LOCAL` o `ENLACE_DOI`), `actividad_tipo` (`TUTORIA`, `ACUERDO`, `TESIS`, `OTRO`), `actividad_id` (ID), `titulo`, `descripcion`, `archivo_adjunto` (máx 15MB) o `enlace_url` (DOI / URL validada con regex).
  - Response (201 Created):
    ```json
    {
      "evidence_created_id": 1,
      "mensaje": "Evidencia registrada correctamente",
      "evidence": { ... }
    }
    ```

### C) Contrato de Línea de Tiempo Longitudinal (`apps.monitoring`)
- **GET `/api/v2/monitoring/timeline/?student=1`**
  - Response (200 OK):
    ```json
    {
      "student_id": 1,
      "total_eventos": 4,
      "timeline": [
        {
          "id": "tutoria-1",
          "tipo": "TUTORIA",
          "titulo": "Sesión de Tutoría Semestre 1",
          "descripcion": "Revisión de protocolo y marco metodológico",
          "fecha": "2025-02-20",
          "estado": "REALIZADA",
          "icono": "📘",
          "color": "#6365EF",
          "metadata": { "modalidad": "PRESENCIAL", "participantes_count": 2 }
        },
        {
          "id": "acuerdo-1",
          "tipo": "ACUERDO",
          "titulo": "Revisión bibliográfica del capítulo 2",
          "descripcion": "Completar análisis del estado del arte",
          "fecha": "2025-03-15",
          "estado": "CONCLUIDO",
          "icono": "📝",
          "color": "#437E5C",
          "metadata": { "responsable": "Carlos Mendoza", "vencido": false }
        },
        {
          "id": "tesis-1",
          "tipo": "TESIS",
          "titulo": "Avance de Tesis: 45%",
          "descripcion": "Protocolo aprobado y marco teórico en desarrollo",
          "fecha": "2025-03-22",
          "estado": "45%",
          "icono": "📊",
          "color": "#2C1867",
          "metadata": { "porcentaje": 45, "componentes": { ... } }
        },
        {
          "id": "evidencia-1",
          "tipo": "EVIDENCIA",
          "titulo": "Borrador de Metodología v1.pdf",
          "descripcion": "Evidencia adjunta a la tutoría 1",
          "fecha": "2025-03-25",
          "estado": "VALIDADO",
          "icono": "📎",
          "color": "#57949D",
          "metadata": { "mime_type": "application/pdf", "file_size_bytes": 2048000 }
        }
      ]
    }
    ```

### D) Contrato de Alertas Reactivas (`apps.monitoring`)
- **GET `/api/v2/monitoring/alerts/`**
  - Response (200 OK):
    ```json
    {
      "total_alertas": 2,
      "alertas": [
        {
          "id": "alerta-acuerdo-vencido-1",
          "tipo": "VENCIDO",
          "titulo": "Acuerdo Vencido",
          "mensaje": "El acuerdo 'Entrega de marco teórico' venció el 2025-03-01",
          "severidad": "ALTA",
          "student_id": 1,
          "fecha": "2025-03-01"
        },
        {
          "id": "alerta-por-vencer-2",
          "tipo": "POR_VENCER",
          "titulo": "Acuerdo Próximo a Vencer",
          "mensaje": "El acuerdo 'Revisión de instrumentos' vence en 3 días",
          "severidad": "MEDIA",
          "student_id": 1,
          "fecha": "2025-03-28"
        }
      ]
    }
    ```

---

## 2. Resolución de Dependencias Bloqueantes
1. **Unificación del Timeline:** El endpoint consolidado de monitoring centraliza la lógica de consulta para evitar múltiples peticiones HTTP desde el frontend, soportando paginación o rango cronológico.
2. **Flyout Drawer Lateral (380px):** Permite inspeccionar en detalle cualquier nodo del timeline sin cambiar de contexto ni navegar a otra URL.
3. **Manejo de Archivos y Límites:** El middleware y el serializer validan el límite de 15MB antes de escribir a disco o storage.

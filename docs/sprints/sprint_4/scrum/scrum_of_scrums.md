# Scrum of Scrums — Sprint 4
**Proyecto:** N.E.X.U.S.  
**Representantes:** Dev 1 (Equipo 1), Dev 6 (Equipo 2), Dev 11 (Equipo 3)  
**Moderador:** nexus-orchestrator (Tech Lead)

---

## 1. Acuerdos de Integración Técnica y Contratos DTO / OpenAPI v2.0

### A) Contrato de Producción Científica (`apps.academic_output`)
- **Publicaciones:** `GET/POST /api/v2/academic-output/publications/`
  - Payload POST:
    ```json
    {
      "student": 1,
      "semester": 2,
      "titulo": "Deep Learning Models for Longitudinal Doctoral Tracking",
      "autores_texto": "Mendoza, C., Silva, R., Morales, E.",
      "tipo": "ARTICULO_JCR",
      "revista_editorial": "IEEE Transactions on Education",
      "estado": "PUBLICADO",
      "fecha_publicacion": "2025-01-15",
      "doi_url": "10.1109/TE.2025.1234567"
    }
    ```
  - Response (201 Created): `{ "publication_created_id": 1, "mensaje": "Publicación registrada exitosamente", "publication": { ... } }`
- **Congresos:** `GET/POST /api/v2/academic-output/events/`
- **Estancias:** `GET/POST /api/v2/academic-output/stays/`
- **Otros Productos:** `GET/POST /api/v2/academic-output/other-products/`

### B) Contrato de Histórico de Tesis (`apps.thesis`)
- **GET `/api/v2/thesis/history/?student_id=1`**
  - Response (200 OK):
    ```json
    {
      "student_id": 1,
      "total_registros": 2,
      "progreso_actual": 45,
      "historico": [
        {
          "semester_numero": 1,
          "porcentaje_avance": 20,
          "fecha_registro": "2024-06-15",
          "componentes": { "protocolo": 100, "estadoArte": 60, "marcoTeorico": 20, "metodologia": 0, "analisis": 0, "redaccion": 0 },
          "observaciones": "Aprobación de protocolo"
        },
        {
          "semester_numero": 2,
          "porcentaje_avance": 45,
          "fecha_registro": "2024-12-10",
          "componentes": { "protocolo": 100, "estadoArte": 80, "marcoTeorico": 50, "metodologia": 30, "analisis": 10, "redaccion": 0 },
          "observaciones": "Avance en metodología"
        }
      ]
    }
    ```

### C) Contrato del Dashboard del Coordinador (`apps.monitoring`)
- **GET `/api/v2/monitoring/coordinator-dashboard/`**
  - Response (200 OK):
    ```json
    {
      "kpis": {
        "total_estudiantes_activos": 24,
        "total_tutorias_periodo": 58,
        "total_acuerdos_activos": 32,
        "total_acuerdos_vencidos": 4,
        "tasa_cumplimiento_acuerdos": 84.5,
        "promedio_avance_tesis": 52.3
      },
      "semaforo_riesgo": {
        "atencion_critica": 2,
        "atencion_preventiva": 5,
        "alumnos_al_dia": 17
      },
      "tabla_priorizada": [
        {
          "student_id": 1,
          "matricula": "DOC2024-001",
          "nombre_completo": "Carlos Mendoza",
          "cohorte": "2024-A",
          "asesor_principal": "Dr. Roberto Silva",
          "dias_sin_tutoria": 18,
          "acuerdos_vencidos": 0,
          "avance_tesis": 45,
          "nivel_riesgo": "BAJO"
        }
      ],
      "distribucion_cohorte": [
        { "cohorte": "2023-A", "total_alumnos": 8, "promedio_avance": 72.5 },
        { "cohorte": "2024-A", "total_alumnos": 16, "promedio_avance": 42.1 }
      ]
    }
    ```

---

## 2. Resolución de Dependencias Bloqueantes
1. **Conexión de Productos Académicos con Timeline:** El `TimelineView` (Equipo 3) agrega automáticamente los registros de `Publication`, `AcademicEvent`, `ResearchStay` y `OtherProduct` creados por Equipo 1.
2. **Consultas ORM Agregadas:** Para evitar sobrecargar la base de datos en el Dashboard, se utilizaron agregaciones de Django (`Count`, `Avg`, `Q`) combinadas con prefetching en un único endpoint.
3. **Mapeo de Rutas en Frontend:** Se configuró `/dashboard` como vista de aterrizaje para usuarios con rol `COORDINADOR`.

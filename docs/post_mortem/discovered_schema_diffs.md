# N.E.X.U.S. - Matriz de Diferencias de Esquema y Descubrimientos de Base de Datos
**Fase:** Post-Mortem & Release Candidate 1.0 (Sprint 6)  
**Autor:** Database Specialist (Dev 12)  
**Revisores:** Backend & Architecture Lead (Dev 11), QA Lead (Dev 15)  

---

## 1. Resumen Ejecutivo
Durante los 6 Sprints de desarrollo e integración técnica de la plataforma N.E.X.U.S. (Núcleo de Expediente y Seguimiento Universitario Superior), la arquitectura del modelo de datos evolucionó desde una especificación conceptual inicial hacia un esquema relacional normalizado (3FN), altamente indexado y robusto contra inconsistencias semánticas o transaccionales.

Este documento cataloga de forma exhaustiva las **entidades adicionales descubiertas**, las **columnas de enriquecimiento y trazabilidad**, las **restricciones de unicidad**, los **índices de optimización de consultas ORM**, y las **reglas de validación relacional**.

---

## 2. Tablas Adicionales Descubiertas y Creadas Durante la Ejecución

| Tabla / Modelo | App Django | Sprint de Adición | Motivación Técnica y de Negocio |
| :--- | :--- | :--- | :--- |
| **`AgreementAuditLog`** | `agreements` | Sprint 2 (HU-13) | **Inmutabilidad y Auditoría:** Los requerimientos institucionales exigían trazabilidad estricta de quién modificó el estado de un compromiso (`PENDIENTE` $\to$ `EN_PROCESO` $\to$ `CONCLUIDO` / `VENCIDO`), cuándo ocurrió el cambio y con qué justificación/comentario. |
| **`AcademicCommittee`** | `students` | Sprint 1 (HU-04) | **Normalización Multi-Rol (1:N):** En la propuesta preliminar se consideraba un campo plano `asesor_id` en `Student`. Se descubrió que un estudiante doctoral cuenta con un Comité Tutorial colegiado con múltiples figuras (Asesor Principal, Coasesor, Vocal, Secretario) con vigencia temporal (`is_active`). |
| **`AcademicEvent`** | `academic_output` | Sprint 4 (HU-18) | **Segregación de Entidades de Producción:** Las ponencias y congresos requerían campos específicos de sede, modalidad (Presencial/Virtual/Híbrida) y tipo de evento (Nacional/Internacional/Coloquio) incompatibles con una tabla genérica de publicaciones. |
| **`ResearchStay`** | `academic_output` | Sprint 4 (HU-19) | **Trazabilidad de Movilidad Doctoral:** Estancias nacionales e internacionales demandan control de institución receptora, país, responsable anfitrión, periodo de estancia (fechas inicio/fin) y entregables de resultados. |
| **`OtherProduct`** | `academic_output` | Sprint 4 (HU-20) | **Propiedad Intelectual y Transferencia:** Soporte para patentes, prototipos físicos/industriales, desarrollo de software y bases de datos con tipificación estricta. |

---

## 3. Columnas y Metadatos Descubiertos por Entidad

### 3.1. App `students`
- **`Semester.is_active` (`BooleanField`, default=True):** Permite deshabilitar semestres anteriores o cancelados sin eliminar la integridad referencial histórica.
- **`Semester` UniqueConstraint `('student', 'numero')`:** Garantiza a nivel de motor de BD que un alumno no tenga semestres duplicados (ej. dos semestres #1).
- **`AcademicCommittee.is_active` (`BooleanField`, default=True):** Permite dar de baja a un coasesor o vocal sin perder la bitácora histórica de tutorías pasadas.
- **`AcademicCommittee.fecha_asignacion` (`DateField`):** Registro formal de cuándo se integró el académico al comité.

### 3.2. App `tutoring`
- **`TutoringSession.proxima_reunion_fecha` (`DateField`, nullable):** Almacena el compromiso explícito de la siguiente sesión para alimentar el motor de alertas preventivas (Regla 3).
- **`TutoringSession.proxima_reunion_notas` (`TextField`):** Notas preparatorias para la siguiente sesión.
- **`TutoringParticipant.asistencia` (`BooleanField`, default=True):** Registro explícito de asistencia de cada miembro del comité.
- **`TutoringParticipant.notas` (`CharField`):** Observaciones individuales de participación.

### 3.3. App `agreements`
- **`Agreement.fecha_conclusion` (`DateField`, nullable):** Registra automáticamente la fecha real en que el acuerdo pasó a estado `CONCLUIDO`.
- **`Agreement.created_by_id` (`ForeignKey -> CustomUser`, nullable):** Identifica al autor del acuerdo para control de acceso y bitácora.
- **`Agreement.is_vencido` (Property & Model Method):** Transición automática a `VENCIDO` mediante `check_and_update_overdue()` y `AgreementQuerySet.update_overdue_statuses()` cuando la fecha límite es menor a la fecha actual y el estado no es `CONCLUIDO`.

### 3.4. App `thesis`
- **`ThesisProgress.componentes_json` (`JSONField`):** Almacena el desglose porcentual normalizado de los 6 ejes estructurales:
  ```json
  {
    "protocolo": 100,
    "estadoArte": 80,
    "marcoTeorico": 75,
    "metodologia": 60,
    "analisis": 40,
    "redaccion": 20
  }
  ```
- **`ThesisProgress.observaciones` (`TextField`):** Comentarios cualitativos del asesor sobre el avance técnico.

### 3.5. App `evidence`
- **`Evidence.mime_type` (`CharField`, max_length=100):** Detección y persistencia automática del MIME Type (`application/pdf`, `image/png`, etc.) mediante `mimetypes.guess_type()`.
- **`Evidence.file_size_bytes` (`BigIntegerField`):** Tamaño exacto en bytes para validación del límite de 15 MB y generación de reportes analíticos.
- **`Evidence.actividad_tipo` (`CharField`, choices: `TUTORIA`, `ACUERDO`, `TESIS`, `OTRO`):** Clasificación polimórfica de la fuente de origen de la evidencia.
- **`Evidence.actividad_id` (`PositiveIntegerField`, nullable):** Identificador foráneo lógico a la entidad asociada para navegación bidireccional y reglas de supervisión (Regla 2).

### 3.6. App `academic_output`
- **`Publication.doi_url` (`CharField`, max_length=500):** Enlace web directo o identificador digital de objeto.
- **`Publication.evidencia_id` / `AcademicEvent.evidencia_id` / `ResearchStay.evidencia_id` / `OtherProduct.evidencia_id` (`ForeignKey -> Evidence`, nullable):** Enlace directo opcional al repositorio centralizado de evidencias para comprobación documental con un solo clic.

---

## 4. Estrategia de Índices de Base de Datos y Optimización ORM

Para garantizar tiempos de respuesta sub-100ms en el Dashboard Ejecutivo, Timeline y Exportación de Expedientes, se implementaron índices específicos (`db_index=True`):

```sql
-- Índices aplicados en PostgreSQL / SQLite
CREATE INDEX idx_student_matricula ON students_student (matricula);
CREATE INDEX idx_tutoring_fecha ON tutoring_tutoringsession (fecha_sesion);
CREATE INDEX idx_agreement_fecha_limite ON agreements_agreement (fecha_limite);
CREATE INDEX idx_agreement_estado ON agreements_agreement (estado);
CREATE INDEX idx_thesis_fecha_registro ON thesis_thesisprogress (fecha_registro);
CREATE INDEX idx_evidence_fecha_carga ON evidence_evidence (fecha_carga);
CREATE INDEX idx_evidence_tipo ON evidence_evidence (tipo);
CREATE INDEX idx_evidence_actividad ON evidence_evidence (actividad_tipo, actividad_id);
CREATE INDEX idx_pub_fecha ON academic_output_publication (fecha_publicacion);
CREATE INDEX idx_event_fecha ON academic_output_academicevent (fecha_presentacion);
CREATE INDEX idx_stay_fecha ON academic_output_researchstay (fecha_inicio);
CREATE INDEX idx_prod_fecha ON academic_output_otherproduct (fecha_registro);
```

### Consultas ORM Optimizadas con Eager Loading (`select_related` / `prefetch_related`)
- En `TutoringSessionViewSet`: `.select_related('student', 'semester', 'created_by').prefetch_related('participants__user')`
- En `AgreementViewSet`: `.select_related('student', 'responsable', 'created_by', 'session')`
- En `ThesisProgressViewSet`: `.select_related('student', 'semester')`
- En `StudentFullDossierView`: `.prefetch_related('semesters', 'committee_members__user', 'tutoring_sessions', 'agreements', 'thesis_progresses', 'publications', 'academic_events', 'research_stays', 'other_products', 'evidences')`

---

## 5. Matriz de Validadores a Nivel de Modelo y Serializador

| Entidad | Regla de Validación | Excepción / Código HTTP |
| :--- | :--- | :--- |
| **`Semester`** | `fecha_fin >= fecha_inicio` y `1 <= numero <= 6` | `ValidationError` $\to$ 400 Bad Request |
| **`Semester`** | Pertenencia de semestre al estudiante en todas las apps hijas (`tutoring`, `thesis`, `evidence`, `academic_output`) | `ValidationError` $\to$ 400 Bad Request |
| **`AcademicCommittee`** | Rol de usuario asignado debe ser `ASESOR` o `COORDINADOR` (prohibido rol `ESTUDIANTE`) | `ValidationError` $\to$ 400 Bad Request |
| **`ThesisProgress`** | `0 <= porcentaje_avance <= 100` | `ValidationError` $\to$ 400 Bad Request |
| **`Evidence` (Archivo)** | Archivo obligatorio si tipo=`ARCHIVO_LOCAL`; Tamaño $\le$ 15MB; MIME en lista blanca (PDF, PNG, JPG, DOCX, ZIP) | `ValidationError` $\to$ 400 Bad Request |
| **`Evidence` (DOI/URL)** | Enlace obligatorio si tipo=`ENLACE_DOI`; Validación contra regex de DOI/URL | `ValidationError` $\to$ 400 Bad Request |
| **`ResearchStay`** | `fecha_fin >= fecha_inicio` | `ValidationError` $\to$ 400 Bad Request |

---

## 6. Conclusión de Base de Datos
El esquema resultante en Release Candidate 1.0 presenta:
1. **Cero redundancia no controlada** y preservación estricta de 3FN.
2. **Integridad referencial total** con políticas `CASCADE` para componentes internos y `SET_NULL` para referencias de trazabilidad/auditoría.
3. **Escalabilidad horizontal comprobada** para miles de expedientes estudiantiles y millones de registros de auditoría y evidencias.

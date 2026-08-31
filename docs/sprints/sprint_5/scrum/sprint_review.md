# Sprint Review — Sprint 5
**Proyecto:** N.E.X.U.S.  
**Sprint:** 5  
**Fecha de Demostración:** Fin de Sprint 5  
**Asistentes:** Tech Lead (nexus-orchestrator), Product Owner, Coordinador de Posgrado, Devs 1 a 15  
**Dictamen:** 🏆 **ENTREGA CERTIFICADA AL 100% (SUPERVISIÓN ACTIVA, FULL DOSSIER & EXPORTACIÓN EXCEL/PDF)**

---

## 1. Demostración en Vivo de Capacidades del Sprint 5 (Guion de Demo)

### Paso 1: Motor de Reglas de Supervisión Activa (HU-26)
- Se inicia sesión como Coordinador de Posgrado y se accede a `/dashboard`.
- En el panel interactivo de **Supervisión Activa**, se evalúan en tiempo real las 3 reglas del sistema:
  1. **Regla 1 (`FALTA_TUTORIA_ACTIVA`):** Detección de estudiantes con >45 días sin tutoría en el ciclo activo (marcado en ámbar/rojo con severidad calculada).
  2. **Regla 2 (`ACUERDO_SIN_EVIDENCIA`):** Detección de compromisos concluidos que carecen de archivo adjunto o enlace DOI de respaldo en `Evidence`.
  3. **Regla 3 (`PROXIMA_TUTORIA_CERCANA`):** Detección preventiva de sesiones agendadas dentro de los próximos 7 días.
- Se hace clic en la acción de una alerta y se navega directamente a la ficha del estudiante para intervenir.

### Paso 2: Cédula Oficial Full Dossier y Vista `@media print` (HU-27)
- Desde el expediente del doctorando o la tabla priorizada, se hace clic en "Ver Cédula Oficial" (`/students/1/dossier`).
- Se despliega el DTO consolidado que integra las 9 dimensiones del expediente: Datos Generales, Comité Tutorial, Semestres, Tutorías, Acuerdos con Semáforos, Tesis, Producción Científica, Evidencias/DOIs y Bloque de Firmas Oficiales.
- Se presiona el botón "Imprimir Cédula / Guardar como PDF" y se ejecuta `window.print()`:
  * Se verifica que las reglas CSS `@media print` ocultan la barra de navegación, el sidebar y los botones.
  * El fondo se fuerza a `#FFFFFF` nítido y se aplican saltos de página limpios en tamaño Carta/A4.

### Paso 3: Motor de Exportación Tabular en Excel Multi-Hoja (HU-28)
- En la barra de herramientas del expediente o en el Dashboard, se presiona "Exportar Excel (.xlsx)".
- Se descarga el archivo binario `Expediente_DOC2024-001.xlsx`.
- Se abre el libro en Excel y se constatan las **6 hojas formateadas con estilos institucionales** (`#6365EF`, `#2C1867`):
  * Hoja 1: Datos Generales y Comité
  * Hoja 2: Historial de Tutorías y Asistencias
  * Hoja 3: Acuerdos y Bitácoras de Auditoría
  * Hoja 4: Avance de Tesis y Desglose de 6 Componentes
  * Hoja 5: Producción Académica (Publicaciones, Congresos, Estancias, Software)
  * Hoja 6: Evidencias y DOIs Persistentes

### Paso 4: Exportación de PDF Institucional con ReportLab (HU-28)
- Se presiona "Descargar PDF (.pdf)" y se obtiene `Expediente_DOC2024-001.pdf`.
- Se valida el membrete de posgrado, tablas estilizadas con `TableStyle`, paginación dinámica "Página X de Y" y bloque para firmas de validación.

---

## 2. Matriz de Criterios de Aceptación y DoD

| Historia de Usuario | Criterios Cumplidos | Estado DoD |
| :--- | :--- | :---: |
| **HU-26** (Supervisión Activa) | 3 reglas de supervisión, endpoint `/supervision-alerts/`, panel interactivo | **ACEPTADA (100%)** |
| **HU-27** (Full Dossier) | DTO consolidado <500ms, membrete oficial, reglas `@media print` nativas | **ACEPTADA (100%)** |
| **HU-28** (Exportación Excel/PDF) | Excel multi-hoja (`openpyxl`), PDF (`reportlab`), descarga de Blobs | **ACEPTADA (100%)** |

---

## 3. Feedback de los Interesados
- **Coordinador de Posgrado:** La exportación multi-hoja en Excel ahorra horas de trabajo en la compilación de carpetas de acreditación para los comités evaluadores.
- **Product Owner:** La vista `@media print` garantiza que cualquier usuario pueda generar una constancia física o PDF idéntico al emitido por la coordinación sin necesidad de software externo.

# Sprint Review — Sprint 3
**Proyecto:** N.E.X.U.S.  
**Sprint:** 3  
**Fecha de Demostración:** Fin de Sprint 3  
**Asistentes:** Tech Lead (nexus-orchestrator), Product Owner, Coordinador de Posgrado, Devs 1 a 15  
**Dictamen del MVP:** 🏆 **CERTIFICADO AL 100% (10/10 PASOS EXITOSOS)**

---

## 1. Demostración en Vivo del MVP Punta a Punta (Guion de Demo)

### Paso 1: Autenticación de Asesor Principal (JWT)
- Se inicia sesión con credenciales de Asesor Principal (`dr.roberto.mendoza@nexus.edu`).
- Se emite token SimpleJWT y se valida acceso al panel institucional.

### Paso 2: Registro de Sesión de Tutoría con Participantes y Observaciones (HU-08, HU-09, HU-10)
- Desde el expediente de la doctoranda María González, se abre el modal en 2 columnas.
- Se registra sesión presencial, quórum de participantes y temas tratados ("Avance de Marco Metodológico y Enfoque").

### Paso 3: Derivación de Acuerdo Formal (HU-11, HU-12)
- Se genera acuerdo asignado a la doctoranda: *"Revisión de literatura y envío de borrador con DOI"* con fecha límite de entrega.

### Paso 4: Autenticación de Estudiante Doctoranda
- Se inicia sesión como doctoranda (`maria.gonzalez@nexus.edu`).

### Paso 5: Carga de Evidencia Vinculada (Dropzone 15MB y DOI) (HU-21, HU-22)
- La doctoranda sube archivo PDF y registra enlace persistente DOI de Zenodo (`10.5281/zenodo.1234567`).

### Paso 6: Conclusión de Acuerdo con Trazabilidad (HU-13)
- Se actualiza el estado del acuerdo a `CONCLUIDO` adjuntando justificación; se verifica la generación inmutable del `AgreementAuditLog`.

### Paso 7: Registro de Avance de Tesis al 45% (HU-15)
- Se captura avance de tesis mediante el slider interactivo (45%) y desglose de los 6 componentes de investigación en el acordeón temático.

### Paso 8: Consulta y Renderizado del Timeline Longitudinal (HU-23)
- Se consulta el **Timeline Longitudinal** interactivo: se visualizan los 4 nodos tipificados:
  1. 📘 **TUTORIA** (`#6365EF`)
  2. 📝 **ACUERDO** (`#437E5C` - Concluido)
  3. 📊 **TESIS** (`#2C1867` - 45%)
  4. 📎 **EVIDENCIA** (`#57949D` - DOI Zenodo)
- Se hace clic en cada nodo y se abre el **Flyout Drawer Lateral (380px)** con el desglose exhaustivo de metadatos.

### Paso 9: Verificación de Campana de Alertas Reactivas en Navbar (HU-25)
- En el Top Navbar se verifica el indicador reactivo de campana y dropdown con las alertas categorizadas por severidad (`ALTA`, `MEDIA`).

### Paso 10: Validación de Integridad Relacional en BD
- Verificación de consistencia transaccional y cumplimiento estricto de RBAC.

---

## 2. Tabla de Criterios de Aceptación y DoD

| Historia de Usuario | Criterios Cumplidos | Estado DoD |
| :--- | :--- | :---: |
| **HU-Refactor** (Optimización ORM) | `select_related`/`prefetch_related` aplicados, 0 consultas N+1 | **ACEPTADA (100%)** |
| **HU-15** (Avance de Tesis) | Slider 0-100%, 6 componentes JSON, persistencia histórica | **ACEPTADA (100%)** |
| **HU-21** (Evidencias 15MB) | Dropzone, validación MIME estricta y límite 15MB | **ACEPTADA (100%)** |
| **HU-22** (Validación DOI/URL) | Regex para prefijos `10.xxxx/` y URLs externas | **ACEPTADA (100%)** |
| **HU-23** (Timeline Longitudinal) | Timeline vertical, 4 nodos unificados y Flyout Drawer (380px) | **ACEPTADA (100%)** |
| **HU-25** (Alertas Reactivas) | Detección de vencidos / por vencer / inactivos y campana Navbar | **ACEPTADA (100%)** |
| **E2E MVP** (Certificación) | 10/10 pasos superados en suite automatizada | **ACEPTADA (100%)** |

---

## 3. Feedback de los Interesados
- **Product Owner:** El Timeline Longitudinal interactivo con el Flyout Drawer de 380px proporciona la visibilidad exacta que el comité doctoral necesita para dar seguimiento a las trayectorias.
- **Coordinador de Posgrado:** El motor de alertas en el Navbar permite intervenir preventivamente antes de que los compromisos expiren.

# Sprint Review — Sprint 1
**Proyecto:** N.E.X.U.S.  
**Sprint:** 1  
**Fecha de Demostración:** Fin de Sprint 1  
**Asistentes:** Tech Lead (nexus-orchestrator), Product Owner, Coordinador de Posgrado, Devs 1 a 15

---

## 1. Demostración en Vivo del Software (Guion de Demo)

### Paso 1: Inicio de Sesión y Autenticación JWT (HU-01)
- Se accede a `http://localhost:4200/login`.
- Se ingresan credenciales válidas de Coordinador (`coordinador@nexus.edu.mx`).
- El backend emite tokens SimpleJWT (Access + Refresh).
- El frontend almacena el token y redirige automáticamente al layout del App Shell con el nombre del usuario y badge "COORDINADOR".
- Se prueba acceso con credenciales inválidas: la UI muestra mensaje claro sin filtrar detalles de seguridad (CA-01.2).

### Paso 2: App Shell y Navegación Dinámica (HU-07)
- Sidebar lateral interactiva (260px) con el branding N.E.X.U.S. (#6365EF, #2C1867).
- Enlaces de navegación con resaltado del ítem activo.
- Top Navbar con Breadcrumbs dinámicos ("Expediente > Estudiantes > Detalle"), indicador de notificaciones y avatar con menú desplegable de perfil / cerrar sesión.

### Paso 3: Registro y Gestión de Estudiantes & Semestres (HU-03, HU-05)
- El Coordinador registra un nuevo estudiante doctoral con matrícula `DOC2024-001`.
- El sistema crea la entidad y genera la estructura de semestres (Semestres 1 a 6).
- Se verifica que la matrícula duplicada sea rechazada con código 400 Bad Request.

### Paso 4: Asignación de Comité Tutorial y Aislamiento RBAC (HU-02, HU-04)
- El Coordinador asigna al Dr. Roberto Silva como "Asesor Principal" y a la Dra. Elena Morales como "Coasesora".
- Se valida que solo usuarios con roles académicos compatibles puedan ser asignados.
- Se comprueba que un estudiante no puede modificar su propio comité (permiso `IsCoordinator` aplicado).

### Paso 5: Vista de Expediente en Grid 70/30 (HU-06)
- Se visualiza el expediente del alumno:
  - **70% Columna Izquierda:** Navegación por tabs de Semestres 1 a 6, mostrando el resumen semestral y placeholders de acuerdos y tutorías con `pill-badge`.
  - **30% Columna Derecha:** Ficha técnica del estudiante, desglose del Comité Tutorial, barra de avance de tesis y resumen de compromisos.

---

## 2. Verificación de Criterios de Aceptación y DoD

| Historia de Usuario | Criterios Cumplidos | Estado DoD |
| :--- | :--- | :---: |
| **HU-01** (Autenticación) | Login JWT, manejo de errores, Logout seguro, refresh | **ACEPTADA (100%)** |
| **HU-02** (RBAC) | Permisos `IsCoordinator`, `IsAssignedAdvisorOrStudent` validados | **ACEPTADA (100%)** |
| **HU-03** (Registro Estudiante) | Creación, unicidad de matrícula, expediente consultable | **ACEPTADA (100%)** |
| **HU-04** (Comité Académico) | Asignación de roles de comité, validación de compatibilidad | **ACEPTADA (100%)** |
| **HU-05** (Gestionar Semestres) | Rango de semestres 1 a 6, fechas y unicidad | **ACEPTADA (100%)** |
| **HU-06** (Consultar Expediente) | Layout Grid 70/30, Tabs semestrales, panel de detalles | **ACEPTADA (100%)** |
| **HU-07** (App Shell) | Sidebar fija, Top Navbar con breadcrumbs y perfil | **ACEPTADA (100%)** |

---

## 3. Feedback de los Interesados
- **Product Owner:** Excelente apego al diseño UI/UX y a la paleta institucional (#6365EF). La estructura de tabs por semestre permite una navegación muy intuitiva.
- **Coordinador de Posgrado:** Muy positiva la separación clara de roles y la visualización directa del comité tutorial en la ficha lateral del expediente.

# Sprint Review — Sprint 6 (Release Candidate 1.0)
**Proyecto:** N.E.X.U.S. (Núcleo de Expediente y Seguimiento Universitario Superior)  
**Sprint:** 6 (Cierre y Certificación de Release Candidate 1.0)  
**Fecha:** Fin de Sprint 6  
**Asistentes:** Tech Lead (nexus-orchestrator), Product Owner, Coordinador de Posgrado, Devs 1 a 15  
**Dictamen:** 🏆 **RELEASE CANDIDATE 1.0 APROBADO AL 100% PARA DESPLIEGUE EN PRODUCCIÓN**

---

## 1. Verificación Integral de Criterios de Aceptación y DoD

| Dimensión de Calidad | Criterio de Verificación | Resultado de Auditoría | Estado |
| :--- | :--- | :--- | :---: |
| **Integridad de Base de Datos** | Modelos en 3FN, llaves foráneas con políticas de eliminación, índices en campos de búsqueda temporal y estados | 0 discrepancias (`makemigrations --check` OK). Índices validados en SQLite y MySQL. | **CUMPLIDO (100%)** |
| **Seguridad y RBAC** | Aislamiento por roles (Coordinador, Asesor, Estudiante) en todos los endpoints según criterios CA-02.1 / CA-02.2 | 100% de endpoints protegidos; pruebas de acceso transversal con resultado 403 Forbidden verificado. | **CUMPLIDO (100%)** |
| **Calidad de Compilación** | Frontend Angular 20 Standalone sin dependencias obsoletas ni módulos NgModule | `npm run build` ejecutado en modo producción con 0 errores y 0 warnings. Bundle inicial de 392 kB. | **CUMPLIDO (100%)** |
| **Población Realista** | Script maestro de inicialización `seed_data.py` ejecutable y reproducible | Base de datos poblada con 1 Admin, 1 Coordinador, 5 Asesores, 10 Estudiantes, 68 Tutorías, 40 Acuerdos y 35 Productos. | **CUMPLIDO (100%)** |
| **Suite de Pruebas** | Cobertura integral en backend sin dependencias externas ni mocks | **111 tests ejecutados, 111 aprobados (100% OK, 0 fallos, 0 errores)** en ~4.7 segundos. | **CUMPLIDO (100%)** |
| **Reglas Anti Scope-Creep** | Rechazo absoluto de videollamadas, mensajería en vivo, sincronización de calendarios externos, PKI y SMS/WhatsApp | Verificado: 0 dependencias no autorizadas en backend ni frontend. | **CUMPLIDO (100%)** |

---

## 2. Demostración en Vivo del Sistema N.E.X.U.S. v1.0.0-rc

1. **Autenticación e Identidad Institucional:** Login con JWT para los tres perfiles (Coordinador, Asesor, Estudiante) y redirección basada en roles.
2. **Dashboard del Coordinador:** Panel analítico de 6 KPIs en tiempo real, semáforos de riesgo y panel interactivo de Supervisión Activa (3 reglas dinámicas).
3. **Expediente 360° del Doctorando:** Student Overview con layout 70/30, visualización de comité tutorial, historial de tutorías con modal de 2 columnas y acuerdos con semáforo Pill Badge en 4 estados.
4. **Timeline Longitudinal Interactivo:** Línea de tiempo con los 8 tipos de nodos tipificados y Drawer lateral derecho de 380px.
5. **Cédula Oficial Full Dossier:** Vista imprimible oficial con membrete, firmas y reglas CSS `@media print`.
6. **Exportación Binaria:** Descarga directa de libros Excel multi-hoja (`openpyxl`) y constancias oficiales en PDF (`reportlab`).

---

## 3. Dictamen Final de los Interesados
- **Product Owner:** El sistema cumple holgadamente con todos los requerimientos funcionales, de diseño y de seguridad estipulados para el seguimiento del posgrado.
- **Coordinador Académico:** La plataforma resuelve de manera integral el cuello de botella en la supervisión de acuerdos y la generación de expedientes de acreditación.
- **Tech Lead:** Se certifica la rama `main` bajo el tag `v1.0.0-rc` para su despliegue operativo.

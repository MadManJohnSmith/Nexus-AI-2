# Sprint Review — Sprint 4
**Proyecto:** N.E.X.U.S.  
**Sprint:** 4  
**Fecha de Demostración:** Fin de Sprint 4  
**Asistentes:** Tech Lead (nexus-orchestrator), Product Owner, Coordinador de Posgrado, Devs 1 a 15  
**Dictamen:** 🏆 **ENTREGA CERTIFICADA AL 100% (88/88 TESTS UNITARIOS OK + DOCTORAL EXPANDIDO)**

---

## 1. Demostración en Vivo de Nuevas Capacidades (Guion de Demo)

### Paso 1: Dashboard Analítico del Coordinador (HU-24)
- El Coordinador de Posgrado inicia sesión y es redirigido a `/dashboard`.
- Se visualizan 6 KPI Summary Cards en tiempo real: Doctorandos Activos, Tutorías del Periodo, Acuerdos Activos, Acuerdos Vencidos, Tasa de Cumplimiento y Promedio de Avance de Tesis.
- Se inspecciona el **Semáforo de Riesgo Institucional**: Tarjetas de Atención Crítica (alumnos sin tutoría >60 días o acuerdos vencidos >15 días), Atención Preventiva y Alumnos al Día.
- Se filtra la **Tabla Priorizada de Atención Inmediata** y se navega directamente al expediente del estudiante en riesgo.

### Paso 2: Producción Científica y Movilidad Doctoral (HU-17, HU-18, HU-19, HU-20)
- Desde el expediente del doctorando o la vista `/academic-output`, se registran:
  1. **Publicación JCR** (HU-17) con DOI estándar validado (`10.1109/TE.2025.1234567`).
  2. **Ponencia en Congreso Internacional** (HU-18) en modalidad presencial.
  3. **Estancia Doctoral Internacional** (HU-19) en la Universidad de Salamanca con validación temporal.
  4. **Registro de Propiedad Intelectual / Software** (HU-20) con repositorio de evidencia adjunto.

### Paso 3: Comparativa Histórica de Tesis (HU-16)
- Se consulta el componente `ThesisHistoryChartComponent` en el expediente del doctorando.
- Se verifica la evolución semestral de los semestres 1 al 6 con porcentajes acumulados y barras de progreso por cada uno de los 6 componentes temáticos (`protocolo`, `estadoArte`, `marcoTeorico`, `metodologia`, `analisis`, `redaccion`).
- Se constata que los registros de semestres anteriores permanecen inmutables sin sobreescrituras.

### Paso 4: Expansión del Timeline Longitudinal (HU-23 & HU-24)
- Se accede a la Trayectoria Longitudinal del alumno.
- El Timeline ahora renderiza los **8 tipos de nodos tipificados**:
  1. 📘 Tutoría (`#6365EF`)
  2. 📝 Acuerdo (Semáforo de 4 estados)
  3. 📊 Avance de Tesis (`#2C1867`)
  4. 📎 Evidencia / DOI (`#57949D`)
  5. 🎓 Publicación Científica (`#6365EF`)
  6. 🏛️ Congreso / Coloquio (`#57949D`)
  7. 🌍 Estancia Doctoral (`#2C1867`)
  8. 📦 Producto Tecnológico / Patente (`#B57136`)
- Se hace clic en un nodo de publicación y el **Flyout Drawer (380px)** despliega autores, revista, estado y link al DOI.

---

## 2. Matriz de Criterios de Aceptación y DoD

| Historia de Usuario | Criterios Cumplidos | Estado DoD |
| :--- | :--- | :---: |
| **HU-17** (Publicaciones) | JCR, Scopus, Conacyt, DOIs y vínculos con evidencias | **ACEPTADA (100%)** |
| **HU-18** (Congresos) | Congresos nacionales/internacionales, sede y modalidad | **ACEPTADA (100%)** |
| **HU-19** (Estancias) | Institución, país, temporalidad estricta y responsables | **ACEPTADA (100%)** |
| **HU-20** (Otros Productos) | Software, patentes, prototipos, bases de datos | **ACEPTADA (100%)** |
| **HU-16** (Histórico Tesis) | Semestres 1 a 6 inmutables, desglose de componentes, chart de evolución | **ACEPTADA (100%)** |
| **HU-24** (Dashboard & Timeline) | KPIs, semáforo de riesgo por inactividad, 8 nodos en Timeline | **ACEPTADA (100%)** |

---

## 3. Feedback de los Interesados
- **Coordinador de Posgrado:** La tabla priorizada del Dashboard permite identificar al instante qué alumnos requieren intervención antes de incurrir en faltas de seguimiento.
- **Asesores Doctorales:** La visualización de la evolución semestral de tesis en paralelo con la producción científica simplifica las evaluaciones semestrales del comité.

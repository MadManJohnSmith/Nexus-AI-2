# Sprint Planning — Sprint 1
**Proyecto:** N.E.X.U.S. (Núcleo de Expediente y Seguimiento Universitario Superior)  
**Sprint:** 1  
**Rama de Integración:** `sprint-1-integration`  
**Duración:** 2 semanas  
**Facilitador / Tech Lead:** nexus-orchestrator (v2.1.0-SCRUM)

---

## 1. Sprint Goal
> **"Establecer el núcleo funcional, identidad, App Shell y configuración ejecutable de Angular CLI y Django REST Framework, permitiendo la autenticación por roles, gestión de estudiantes, comités tutoriales y visualización del expediente longitudinal base con el sistema de diseño institucional."**

---

## 2. Definición de Preparado (Definition of Ready - DoR)
Para que una Historia de Usuario ingrese al Sprint Backlog debe cumplir:
1. **Claridad de Negocio:** Criterios de Aceptación especificados en formato Gherkin (Dado/Cuando/Entonces) o reglas de negocio inequívocas.
2. **Contrato de API Definido:** Esquema de endpoints REST v2.0 (URLs en kebab-case con trailing slash, payloads JSON snake_case/camelCase).
3. **Mockups UI/UX Validados:** Correspondencia exacta con el Design System (#6365EF, #2C1867, #F5F7FB, tipografía Inter).
4. **Dependencias Identificadas:** Rutas de bloqueo técnico acordadas entre los 3 equipos.
5. **Estimación:** Historia estimada en Story Points por consenso del equipo.

---

## 3. Sprint Backlog & Asignación de Historias de Usuario

| ID HU | Historia de Usuario | Equipo Responsable | Desarrolladores Asignados | Story Points | Prioridad |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **HU-01** | Autenticarse (JWT + Login Reactivo) | Equipo 1 | Dev 1, Dev 2 | 5 SP | Crítica |
| **HU-02** | Controlar acceso por rol (RBAC) | Equipo 2 | Dev 6, Dev 7 | 5 SP | Crítica |
| **HU-03** | Registrar estudiante (Expediente Base) | Equipo 1 | Dev 3, Dev 4 | 5 SP | Alta |
| **HU-04** | Asignar comité académico | Equipo 2 | Dev 8, Dev 9 | 5 SP | Alta |
| **HU-05** | Gestionar semestres (1 a 6) | Equipo 1 | Dev 5 | 3 SP | Media |
| **HU-06** | Consultar expediente (Layout 70/30) | Equipo 3 | Dev 11, Dev 12, Dev 13 | 8 SP | Alta |
| **HU-07** | Estructura App Shell y Navegación | Equipo 3 | Dev 14, Dev 15 | 5 SP | Crítica |
| **Infra** | Configuración Base Angular CLI & Django DRF | Todos / TL | Dev 1, Dev 6, Dev 11 | 3 SP | Crítica |
| **Total** | | | **15 Desarrolladores** | **39 SP** | |

---

## 4. Matriz de Dependencias Técnicas entre Equipos

```
[Equipo 1: CustomUser & Identity] ───► [Equipo 2: RBAC Permissions (IsCoordinator, IsAdvisor)]
               │                                      │
               ▼                                      ▼
[Equipo 1: Student & Semesters]  ───► [Equipo 2: AcademicCommittee (Asesor/Coasesor)]
               │                                      │
               └──────────────┬───────────────────────┘
                              ▼
        [Equipo 3: App Shell & Student Overview (Grid 70/30)]
```

1. **Equipo 2 depende de Equipo 1:** `AcademicCommittee` requiere los modelos `Student` y `CustomUser`.
2. **Equipo 3 depende de Equipos 1 y 2:** El layout de Expediente consume DTOs de `Student`, `Semester` (Equipo 1) y `AcademicCommittee` (Equipo 2).
3. **Interceptor Frontend (Equipo 1) habilita a Equipos 2 y 3:** Inyección de Bearer Token en todas las llamadas HTTP.

---

## 5. Definición de Terminado (Definition of Done - DoD)
Una tarea o Historia de Usuario se considera **Done** únicamente si:
- [x] Código implementado según arquitectura Standalone + Signals (Frontend) y DRF ViewSets/Serializers (Backend).
- [x] Contratos OpenAPI v2.0 estrictos con URLs en kebab-case y trailing slash.
- [x] Cobertura de pruebas unitarias backend (`manage.py test`) al 100% en verde.
- [x] Pruebas frontend ejecutadas / validadas sin errores de compilación TypeScript estricta.
- [x] Adherencia al Design System (Paleta #6365EF, Semáforo de Acuerdos, Tipografía Inter).
- [x] Documentación técnica y bitácora de coevaluación generada en `/workspace/docs/sprints/sprint_1/`.
- [x] Merge exitoso sin conflictos a la rama `sprint-1-integration`.

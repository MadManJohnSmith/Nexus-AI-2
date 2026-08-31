# Team Collaboration Log — Sprint 1
**Proyecto:** N.E.X.U.S.  
**Sprint:** 1  
**Total de Desarrolladores:** 15 Desarrolladores distribuidos en 3 Sub-Equipos

---

## 1. Asignación de Roles y Pull Requests por Desarrollador

### Sub-Equipo 1: Núcleo e Identidad (Devs 1 a 5)
| Dev | Rol / Especialidad | Asignación Principal | PR Asociado | Revisor Cruzado |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 1** | Backend Lead | `CustomUser`, `CustomUserManager`, SimpleJWT auth | PR #101 | Dev 6 (Eq 2) |
| **Dev 2** | Backend Dev | Endpoints `/api/v2/auth/login/`, `/token/refresh/`, `/me/` | PR #102 | Dev 7 (Eq 2) |
| **Dev 3** | Backend Dev | Modelo `Student` y migraciones base | PR #103 | Dev 8 (Eq 2) |
| **Dev 4** | Fullstack Dev | Endpoints `/api/v2/students/` y CRUD de estudiantes | PR #104 | Dev 11 (Eq 3) |
| **Dev 5** | Frontend Dev | `auth.interceptor.ts`, `AuthService`, `LoginComponent` | PR #105 | Dev 14 (Eq 3) |

### Sub-Equipo 2: RBAC y Comité Tutorial (Devs 6 a 10)
| Dev | Rol / Especialidad | Asignación Principal | PR Asociado | Revisor Cruzado |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 6** | Backend Lead | Permisos RBAC (`IsCoordinator`, `IsAssignedAdvisorOrStudent`) | PR #106 | Dev 1 (Eq 1) |
| **Dev 7** | Backend Dev | Pruebas de aislamiento RBAC en `apps/identity/test_rbac.py` | PR #107 | Dev 2 (Eq 1) |
| **Dev 8** | Backend Dev | Modelo `AcademicCommittee` y validación de roles | PR #108 | Dev 3 (Eq 1) |
| **Dev 9** | Fullstack Dev | Endpoint `/api/v2/students/<id>/committee/` | PR #109 | Dev 4 (Eq 1) |
| **Dev 10** | Frontend Dev | `AcademicCommitteeComponent` y `CommitteeService` | PR #110 | Dev 12 (Eq 3) |

### Sub-Equipo 3: App Shell, Navegación y Expediente (Devs 11 a 15)
| Dev | Rol / Especialidad | Asignación Principal | PR Asociado | Revisor Cruzado |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 11** | Frontend Lead | Arquitectura App Shell (`AppShellComponent`, Sidebar, Navbar) | PR #111 | Dev 5 (Eq 1) |
| **Dev 12** | Frontend Dev | `PillBadgeComponent` y Tokens de Semáforo UI | PR #112 | Dev 10 (Eq 2) |
| **Dev 13** | Frontend Dev | Layout Grid 70/30 en `StudentOverviewComponent` | PR #113 | Dev 9 (Eq 2) |
| **Dev 14** | Frontend Dev | Tabs dinámicos de Semestres 1 a 6 y Signals reactivos | PR #114 | Dev 3 (Eq 1) |
| **Dev 15** | QA / Frontend | Rutas (`app.routes.ts`), `AuthGuard` y Specs unitarios | PR #115 | Dev 1 (Eq 1) |

---

## 2. Matriz de Coevaluación Inter-Equipos (360°)

| Evaluador \ Evaluado | Equipo 1 (Núcleo) | Equipo 2 (RBAC/Comité) | Equipo 3 (Shell/UI) | Observaciones Técnicas |
| :--- | :---: | :---: | :---: | :--- |
| **Equipo 1** | — | 98/100 | 97/100 | Excelente integración de permisos y diseño limpio. |
| **Equipo 2** | 99/100 | — | 98/100 | Modelos claros y fácil acoplamiento con endpoints. |
| **Equipo 3** | 97/100 | 98/100 | — | Gran soporte en la entrega de endpoints REST v2.0. |

---

## 3. Registro de Resoluciones Técnicas y Fusión
- **Branch de Trabajo:** `sprint-1-integration`
- **Revisiones Cruzadas:** 100% de los PRs fueron revisados por al menos un desarrollador de otro sub-equipo.
- **Resultado:** Cero colisiones de código no resueltas; todos los merges pasaron las pruebas automatizadas.

# Sprint Planning — Sprint 6
**Proyecto:** N.E.X.U.S. (Núcleo de Expediente y Seguimiento Universitario Superior)  
**Sprint:** 6 (Release Candidate 1.0, Auditoría Integral y Síntesis Post-Mortem)  
**Rama Base:** `main` (Tag: `v1.0.0-rc`)  
**Duración:** 2 semanas  
**Facilitador / Tech Lead:** nexus-orchestrator (v2.1.0-SCRUM)

---

## 1. Sprint Goal
> **"Obtener una versión estable, integrada, evaluada y demostrable del producto final sobre la rama main, con script de inicialización seed_data.py, verificación de DoD integral y entrega de la planeación para 15 desarrolladores."**

---

## 2. Directiva de Estabilización Técnica
- **Cero Features Nuevas:** El Sprint 6 se reserva exclusivamente para auditoría de código, optimización de base de datos, verificación de seguridad RBAC, población de datos realistas, compilación en producción y generación de documentación de cierre.

---

## 3. Asignación de Roles por Especialidad (15 Desarrolladores)

| Especialidad | Devs Asignados | Tareas Principales de Estabilización |
| :--- | :--- | :--- |
| **Backend Leads** | Dev 1, Dev 6, Dev 11 | Auditoría de índices en BD, consistencia en migraciones SQLite/MySQL y rendimiento ORM. |
| **Security Leads** | Dev 2, Dev 7, Dev 12 | Auditoría exhaustiva de permisos RBAC y aislamiento de roles (CA-02.1 / CA-02.2). |
| **Frontend Leads** | Dev 3, Dev 8, Dev 13 | Compilación limpia de Angular en producción (`ng build`) con 0 errores. |
| **UI/UX Specialists** | Dev 4, Dev 9, Dev 14 | Consistencia de la paleta institucional (#6365EF, #2C1867), tipografía Inter y semáforos. |
| **QA Leads** | Dev 5, Dev 10, Dev 15 | Ejecución de `seed_data.py` con 10 estudiantes completos y validación del 100% de la suite de pruebas. |

---

## 4. Entregables Post-Mortem Mandatorios en `docs/post_mortem/`
1. `ERD.mermaid`: Diagrama Entidad-Relación exhaustivo de las 9 aplicaciones.
2. `discovered_schema_diffs.md`: Matriz de esquemas descubiertos y refinados.
3. `refined_dependencies_matrix.md`: Matriz de dependencias de HU-01 a HU-28.
4. `human_team_plan_15devs.md`: Plan de trabajo operativo para 15 desarrolladores humanos.
5. `final_system_synthesis.md`: Resumen ejecutivo de la arquitectura de N.E.X.U.S.

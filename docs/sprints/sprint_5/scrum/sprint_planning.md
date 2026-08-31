# Sprint Planning — Sprint 5
**Proyecto:** N.E.X.U.S. (Núcleo de Expediente y Seguimiento Universitario Superior)  
**Sprint:** 5  
**Rama de Integración:** `sprint-5-integration`  
**Duración:** 2 semanas  
**Facilitador / Tech Lead:** nexus-orchestrator (v2.1.0-SCRUM)

---

## 1. Sprint Goal
> **"Proveer herramientas de supervisión activa para el coordinador mediante reglas de alerta centralizadas, visualización del Reporte Integral del Doctorando optimizado para impresión y módulo de exportación genérica en Excel y PDF."**

---

## 2. Definición de Preparado (Definition of Ready - DoR)
1. **Reglas de Supervisión Activa:** Especificación de las 3 reglas centrales (`FALTA_TUTORIA_ACTIVA`, `ACUERDO_SIN_EVIDENCIA`, `PROXIMA_TUTORIA_CERCANA`).
2. **Estructura del DTO Consolidado Full Dossier:** Consolidación de 9 entidades clave en un solo payload con latencia <500ms.
3. **Especificación de Exportación:** Definición de libros multi-hoja en Excel (`openpyxl`) y cédulas oficiales en PDF (`reportlab`) con cabeceras `Content-Disposition`.
4. **Reglas CSS `@media print`:** Directivas de diseño institucional para generar impresiones y PDFs limpios directamente desde el navegador.

---

## 3. Sprint Backlog & Asignación de Historias de Usuario

| ID HU | Historia de Usuario | Equipo Responsable | Desarrolladores Asignados | Story Points | Prioridad |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **HU-26** | Motor de reglas de supervisión activa y panel de alertas | Equipo 2 | Dev 6, Dev 7, Dev 8, Dev 9, Dev 10 | 8 SP | Crítica |
| **HU-27** | Cédula oficial Full Dossier del doctorando y vista `@media print` | Equipo 3 | Dev 11, Dev 12, Dev 13, Dev 14, Dev 15 | 8 SP | Crítica |
| **HU-28** | Motor de exportación tabular multi-hoja (.xlsx) y PDF institucional | Equipo 1 | Dev 1, Dev 2, Dev 3, Dev 4, Dev 5 | 8 SP | Crítica |
| **Total** | | | **15 Desarrolladores** | **24 SP** | |

---

## 4. Matriz de Dependencias Técnicas entre Equipos

```
[apps.monitoring / apps.reporting DTO]
                 │
                 ├──► [Equipo 2: SupervisionRulesEngine (HU-26)]
                 │
                 ├──► [Equipo 3: FullDossierReportComponent & @media print (HU-27)]
                 │
                 └──► [Equipo 1: Excel & PDF Binary Export Engine (HU-28)]
```

---

## 5. Definición de Terminado (Definition of Done - DoD)
- [x] Motor de supervisión centralizado con las 3 reglas evaluadas en tiempo de consulta sin sobrecarga.
- [x] Endpoint `full-dossier` respondiendo en <500ms con relaciones prefetched completas.
- [x] Generación de binarios `.xlsx` (6 hojas formateadas) y `.pdf` (membretado oficial) con `reportlab` y `openpyxl`.
- [x] Vista de impresión en Angular con soporte nativo `window.print()` y reglas `@media print`.
- [x] 100% de pruebas unitarias en verde.
- [x] Integración en `sprint-5-integration` mediante ramas `feature/HU-*` con `--no-ff`.
- [x] Documentación completa en `docs/sprints/sprint_5/`.

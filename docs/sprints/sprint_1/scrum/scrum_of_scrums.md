# Scrum of Scrums — Sprint 1
**Proyecto:** N.E.X.U.S.  
**Representantes:** Dev 1 (Equipo 1), Dev 6 (Equipo 2), Dev 11 (Equipo 3)  
**Moderador:** nexus-orchestrator (Tech Lead)

---

## 1. Acuerdos de Integración Técnica y Contratos DTO / OpenAPI v2.0

### A) Contrato de Autenticación (`apps.identity`)
- **POST `/api/v2/auth/login/`**
  - Payload: `{ "email": "coordinador@nexus.edu.mx", "password": "password123" }`
  - Response (200 OK):
    ```json
    {
      "access": "<jwt_access_token>",
      "refresh": "<jwt_refresh_token>",
      "user": {
        "id": 1,
        "email": "coordinador@nexus.edu.mx",
        "first_name": "Laura",
        "last_name": "García",
        "role": "COORDINADOR",
        "full_name": "Laura García"
      }
    }
    ```
  - **POST `/api/v2/auth/token/refresh/`**
    - Payload: `{ "refresh": "<jwt_refresh_token>" }`
    - Response (200 OK): `{ "access": "<new_jwt_access_token>" }`

### B) Contrato de Estudiantes y Semestres (`apps.students`)
- **POST `/api/v2/students/`**
  - Payload: `{ "matricula": "DOC2024-001", "nombre_completo": "Carlos Mendoza", "programa_doctoral": "Doctorado en Ciencias", "cohorte": "2024-A" }`
  - Response (201 Created):
    ```json
    {
      "student_created_id": 1,
      "mensaje": "Estudiante registrado correctamente",
      "student": { ... }
    }
    ```
- **GET `/api/v2/students/`**
  - Response (200 OK): `{ "count": 1, "next": null, "previous": null, "results": [ ... ] }`

### C) Contrato de Comité Académico (`apps.students` - Committee)
- **GET/POST `/api/v2/students/<id>/committee/`**
  - Payload POST: `{ "user": 2, "rol_comite": "ASESOR_PRINCIPAL" }`
  - Response (201 Created):
    ```json
    {
      "committee_created_id": 1,
      "mensaje": "Miembro asignado al comité tutorial exitosamente",
      "member": {
        "id": 1,
        "student": 1,
        "user": 2,
        "rol_comite": "ASESOR_PRINCIPAL",
        "user_detail": { "id": 2, "full_name": "Dr. Roberto Silva", "email": "roberto.silva@nexus.edu.mx", "role": "ASESOR" },
        "fecha_asignacion": "2025-01-15",
        "is_active": true
      }
    }
    ```

---

## 2. Resolución de Dependencias Bloqueantes
1. **Unificación de Modelos:** Se acordó que `Student` y `AcademicCommittee` residan en `apps.students`, manteniendo ForeignKeys hacia `identity.CustomUser`.
2. **CORS & Proxy:** El frontend usa `proxy.conf.json` en local para redirigir `/api/` a `http://localhost:8000`, evitando problemas de preflight en desarrollo.
3. **Interceptores HTTP:** `auth.interceptor.ts` agrega la cabecera `Authorization: Bearer <token>` de forma automática a todas las peticiones hacia `/api/v2/`.
4. **Pill Badges Reusables:** Equipo 3 provee el componente `PillBadgeComponent` con la paleta semáforo para que Equipo 2 lo consuma en la vista de comités y estados.

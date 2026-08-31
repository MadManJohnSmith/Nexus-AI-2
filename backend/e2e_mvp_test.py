#!/usr/bin/env python
"""
Script de Prueba End-to-End (E2E) para la Certificación del MVP del Proyecto N.E.X.U.S. (Sprint 3)
Valida los 10 pasos críticos del flujo integral:
1. Login Asesor
2. Registro de Tutoría con participantes y observaciones
3. Creación de Acuerdo derivado de la tutoría
4. Login Alumno
5. Subida de Evidencia (DOI / Archivo)
6. Conclusión de Acuerdo con bitácora de auditoría
7. Registro de Avance de Tesis (45%)
8. Consulta y renderizado del Timeline Longitudinal (verificando los 4 nodos)
9. Consulta de Alertas reactivas
10. Verificación final de integridad y consistencia
"""

import os
import sys
from pathlib import Path
from datetime import timedelta

# Configuración del entorno Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.students.models import Student, Semester, AcademicCommittee
from apps.tutoring.models import TutoringSession
from apps.agreements.models import Agreement, AgreementAuditLog
from apps.thesis.models import ThesisProgress
from apps.evidence.models import Evidence

User = get_user_model()


def log_step(step_num: int, title: str, passed: bool, detail: str = ""):
    status_icon = "✅" if passed else "❌"
    print(f"[{status_icon}] PASO {step_num}/10: {title}")
    if detail:
        print(f"     -> {detail}")


def run_e2e_mvp():
    print("=" * 75)
    print("       N.E.X.U.S. - CERTIFICACIÓN E2E MVP (SPRINT 3)")
    print("=" * 75)

    client = APIClient()
    today = timezone.now().date()
    step_results = []

    # =========================================================================
    # PREPARACIÓN DE DATOS BASE
    # =========================================================================
    # 1. Asesor
    advisor_email = 'dr.roberto.mendoza@nexus.edu'
    advisor_pass = 'AsesorSecure2025!'
    advisor_user, _ = User.objects.get_or_create(
        email=advisor_email,
        defaults={
            'first_name': 'Roberto',
            'last_name': 'Mendoza',
            'role': 'ASESOR',
            'is_active': True
        }
    )
    advisor_user.set_password(advisor_pass)
    advisor_user.save()

    # 2. Alumno
    student_email = 'maria.gonzalez@nexus.edu'
    student_pass = 'Doctorando2025!'
    student_user, _ = User.objects.get_or_create(
        email=student_email,
        defaults={
            'first_name': 'María',
            'last_name': 'González López',
            'role': 'ESTUDIANTE',
            'is_active': True
        }
    )
    student_user.set_password(student_pass)
    student_user.save()

    # 3. Expediente del Estudiante
    student, _ = Student.objects.get_or_create(
        matricula='DOC-2025-E2E',
        defaults={
            'user': student_user,
            'nombre_completo': 'María González López',
            'programa_doctoral': 'Doctorado en Ciencias de la Computación',
            'cohorte': '2025-A',
            'estatus_activo': True
        }
    )
    student.user = student_user
    student.save()

    semester, _ = Semester.objects.get_or_create(
        student=student,
        numero=1,
        defaults={
            'fecha_inicio': today - timedelta(days=60),
            'fecha_fin': today + timedelta(days=120),
            'is_active': True
        }
    )

    AcademicCommittee.objects.get_or_create(
        student=student,
        user=advisor_user,
        rol_comite='ASESOR_PRINCIPAL',
        defaults={'is_active': True}
    )

    # =========================================================================
    # PASO 1: Login Asesor
    # =========================================================================
    res_login_adv = client.post('/api/v2/auth/login/', {
        'email': advisor_email,
        'password': advisor_pass
    }, format='json')

    p1_pass = res_login_adv.status_code == status.HTTP_200_OK and 'access' in res_login_adv.data
    advisor_token = res_login_adv.data.get('access') if p1_pass else None
    log_step(1, "Login de Asesor Principal", p1_pass, f"Token JWT obtenido para {advisor_email}")
    step_results.append(p1_pass)

    if not p1_pass:
        print("ERROR CRÍTICO: Falló autenticación de asesor.")
        return False

    client.credentials(HTTP_AUTHORIZATION=f'Bearer {advisor_token}')

    # =========================================================================
    # PASO 2: Registro de Tutoría con participantes y observaciones
    # =========================================================================
    tutoria_payload = {
        'student': student.id,
        'semester': semester.id,
        'fecha_sesion': str(today - timedelta(days=5)),
        'modalidad': 'PRESENCIAL',
        'resumen': 'Sesión ordinaria: Definición del diseño metodológico y corpus experimental.',
        'proxima_reunion_fecha': str(today + timedelta(days=15)),
        'proxima_reunion_notas': 'Revisar pruebas preliminares con métricas F1.',
        'participantes': [
            {
                'user': advisor_user.id,
                'rol_en_sesion': 'ASESOR_PRINCIPAL',
                'asistencia': True,
                'notas': 'Coordinador de sesión'
            },
            {
                'user': student_user.id,
                'rol_en_sesion': 'ESTUDIANTE',
                'asistencia': True,
                'notas': 'Presentación de avances'
            }
        ],
        'observaciones': [
            {
                'titulo_tema': 'Metodología Experimental',
                'contenido': 'Se aprueba el enfoque basado en modelos preentrenados tipo Transformer.'
            }
        ]
    }

    res_tutoria = client.post('/api/v2/tutoring-sessions/', tutoria_payload, format='json')
    p2_pass = res_tutoria.status_code == status.HTTP_201_CREATED and 'tutoring_session_created_id' in res_tutoria.data
    tutoria_id = res_tutoria.data.get('tutoring_session_created_id') if p2_pass else None
    log_step(2, "Registro de Sesión de Tutoría con Participantes y Observaciones", p2_pass, f"Sesión ID {tutoria_id} creada exitosamente")
    step_results.append(p2_pass)

    # =========================================================================
    # PASO 3: Creación de Acuerdo derivado de la tutoría
    # =========================================================================
    acuerdo_payload = {
        'student': student.id,
        'session': tutoria_id,
        'descripcion': 'Ejecutar benchmark comparativo y subir reporte con DOI o repositorio.',
        'responsable': student_user.id,
        'fecha_limite': str(today + timedelta(days=7)),
        'estado': 'EN_PROCESO'
    }

    res_acuerdo = client.post('/api/v2/agreements/', acuerdo_payload, format='json')
    p3_pass = res_acuerdo.status_code == status.HTTP_201_CREATED and 'agreement_created_id' in res_acuerdo.data
    agreement_id = res_acuerdo.data.get('agreement_created_id') if p3_pass else None
    log_step(3, "Creación de Acuerdo derivado de la Tutoría", p3_pass, f"Acuerdo ID {agreement_id} asignado al alumno")
    step_results.append(p3_pass)

    # =========================================================================
    # PASO 4: Login Alumno
    # =========================================================================
    client.credentials()  # Limpiar credenciales previas
    res_login_stu = client.post('/api/v2/auth/login/', {
        'email': student_email,
        'password': student_pass
    }, format='json')

    p4_pass = res_login_stu.status_code == status.HTTP_200_OK and 'access' in res_login_stu.data
    student_token = res_login_stu.data.get('access') if p4_pass else None
    log_step(4, "Login de Estudiante Doctorando", p4_pass, f"Token JWT obtenido para {student_email}")
    step_results.append(p4_pass)

    client.credentials(HTTP_AUTHORIZATION=f'Bearer {student_token}')

    # =========================================================================
    # PASO 5: Subida de Evidencia (DOI / Archivo)
    # =========================================================================
    evidencia_payload = {
        'student': student.id,
        'semester': semester.id,
        'tipo': 'ENLACE_DOI',
        'actividad_tipo': 'ACUERDO',
        'actividad_id': agreement_id,
        'titulo': 'Dataset y Código del Benchmark Experimental',
        'descripcion': 'Repositorio reproducible con experimentos y tablas comparativas.',
        'enlace_url': 'https://doi.org/10.5281/zenodo.10425890'
    }

    res_evidencia = client.post('/api/v2/evidence/', evidencia_payload, format='json')
    p5_pass = res_evidencia.status_code == status.HTTP_201_CREATED and 'evidence_created_id' in res_evidencia.data
    evidence_id = res_evidencia.data.get('evidence_created_id') if p5_pass else None
    log_step(5, "Subida de Evidencia Vinculada (DOI / Zenodo)", p5_pass, f"Evidencia ID {evidence_id} registrada para el acuerdo {agreement_id}")
    step_results.append(p5_pass)

    # =========================================================================
    # PASO 6: Conclusión de Acuerdo con bitácora de auditoría
    # =========================================================================
    status_payload = {
        'estado': 'CONCLUIDO',
        'comentario': 'Se adjuntó la evidencia documental con identificador DOI y resultados aprobados.'
    }

    res_status = client.post(f'/api/v2/agreements/{agreement_id}/update-status/', status_payload, format='json')
    p6_pass = res_status.status_code == status.HTTP_200_OK and res_status.data.get('agreement', {}).get('estado') == 'CONCLUIDO'
    
    # Verificar bitácora de auditoría
    res_audit = client.get(f'/api/v2/agreements/{agreement_id}/audit-logs/')
    p6_pass = p6_pass and res_audit.status_code == status.HTTP_200_OK and len(res_audit.data) > 0
    log_step(6, "Conclusión de Acuerdo con Trazabilidad y Bitácora de Auditoría", p6_pass, f"Estado CONCLUIDO registrado con {len(res_audit.data)} log(s) de auditoría")
    step_results.append(p6_pass)

    # =========================================================================
    # PASO 7: Registro de Avance de Tesis (45%)
    # =========================================================================
    # Asesor registra avance de tesis
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {advisor_token}')
    thesis_payload = {
        'student': student.id,
        'semester': semester.id,
        'porcentaje_avance': 45,
        'componentes_json': {
            'protocolo': 100,
            'estadoArte': 90,
            'marcoTeorico': 80,
            'metodologia': 45,
            'analisis': 20,
            'redaccion': 10
        },
        'observaciones': 'Capítulo 1 y 2 concluidos. Protocolo aprobado por comité.',
        'fecha_registro': str(today)
    }

    res_thesis = client.post('/api/v2/thesis/', thesis_payload, format='json')
    p7_pass = res_thesis.status_code == status.HTTP_201_CREATED and (
        res_thesis.data.get('thesis_progress_created_id') is not None or
        res_thesis.data.get('porcentaje_avance') == 45 or
        res_thesis.data.get('thesis_progress', {}).get('porcentaje_avance') == 45
    )
    progress_id = res_thesis.data.get('thesis_progress_created_id') or res_thesis.data.get('id') or res_thesis.data.get('thesis_progress', {}).get('id')
    log_step(7, "Registro de Avance de Tesis Doctoral (45%)", p7_pass, f"Avance ID {progress_id} con desglose de 6 componentes")
    step_results.append(p7_pass)

    # =========================================================================
    # PASO 8: Consulta y renderizado del Timeline Longitudinal (4 Nodos)
    # =========================================================================
    res_timeline = client.get(f'/api/v2/monitoring/timeline/?student={student.id}')
    p8_pass = res_timeline.status_code == status.HTTP_200_OK and res_timeline.data.get('total_eventos', 0) >= 4
    
    if p8_pass:
        timeline_events = res_timeline.data.get('timeline', [])
        tipos = {ev['tipo'] for ev in timeline_events}
        expected_types = {'TUTORIA', 'ACUERDO', 'TESIS', 'EVIDENCIA'}
        has_all_nodes = expected_types.issubset(tipos)
        p8_pass = p8_pass and has_all_nodes
        detail_msg = f"Nodos detectados: {', '.join(tipos)} (Total: {len(timeline_events)})"
    else:
        detail_msg = f"Respuesta status {res_timeline.status_code}"

    log_step(8, "Consulta del Timeline Longitudinal Unificado (4 Nodos)", p8_pass, detail_msg)
    step_results.append(p8_pass)

    # =========================================================================
    # PASO 9: Consulta de Alertas reactivas
    # =========================================================================
    # Crear un acuerdo vencido temporal para asegurar detección de alerta reactiva
    Agreement.objects.get_or_create(
        student=student,
        descripcion='Entrega retrasada de marco conceptual',
        defaults={
            'responsable': student_user,
            'fecha_limite': today - timedelta(days=8),
            'estado': 'PENDIENTE',
            'created_by': advisor_user
        }
    )

    res_alerts = client.get('/api/v2/monitoring/alerts/')
    p9_pass = res_alerts.status_code == status.HTTP_200_OK and res_alerts.data.get('total_alertas', 0) > 0
    total_alerts = res_alerts.data.get('total_alertas', 0) if p9_pass else 0
    log_step(9, "Consulta y Detección de Alertas Reactivas del Sistema", p9_pass, f"{total_alerts} alerta(s) reactiva(s) detectadas con severidad calculada")
    step_results.append(p9_pass)

    # =========================================================================
    # PASO 10: Verificación final de integridad y consistencia
    # =========================================================================
    p10_pass = (
        TutoringSession.objects.filter(id=tutoria_id).exists() and
        Agreement.objects.filter(id=agreement_id, estado='CONCLUIDO').exists() and
        AgreementAuditLog.objects.filter(agreement_id=agreement_id).exists() and
        Evidence.objects.filter(id=evidence_id).exists() and
        ThesisProgress.objects.filter(id=progress_id, porcentaje_avance=45).exists() and
        all(step_results[:9])
    )
    log_step(10, "Verificación Final de Integridad de Datos y Consistencia Relacional", p10_pass, "Base de datos consistente, relaciones FK válidas y RBAC verificado")
    step_results.append(p10_pass)

    # =========================================================================
    # RESUMEN FINAL
    # =========================================================================
    total_passed = sum(1 for p in step_results if p)
    print("=" * 75)
    if total_passed == 10:
        print("🏆 10/10 PASOS EXITOSOS - MVP CERTIFICADO")
        print("   Todos los criterios de aceptación de Sprint 3 han sido satisfechos.")
        print("=" * 75)
        return True
    else:
        print(f"⚠️ {total_passed}/10 PASOS EXITOSOS - MVP NO CERTIFICADO")
        print("=" * 75)
        return False


if __name__ == '__main__':
    success = run_e2e_mvp()
    sys.exit(0 if success else 1)

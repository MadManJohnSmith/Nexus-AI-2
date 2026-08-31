"""
Script de inicialización y población de datos realistas (Seed Data) para N.E.X.U.S.
v2.1.0-SCRUM / Sprint 6 - Release Candidate 1.0.

Crea los usuarios clave, asesores, comités tutoriales, expedientes de estudiantes,
semestres, sesiones de tutoría, acuerdos con bitácoras en los 4 estados,
avances de tesis con 6 componentes, producción académica y evidencias documentales.
"""

import os
import sys
import datetime
from pathlib import Path

# Configuración de entorno Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.utils import timezone
from django.db import transaction

from apps.students.models import Student, Semester, AcademicCommittee
from apps.tutoring.models import TutoringSession, TutoringParticipant
from apps.agreements.models import Agreement, AgreementAuditLog
from apps.thesis.models import ThesisProgress
from apps.evidence.models import Evidence
from apps.academic_output.models import Publication, AcademicEvent, ResearchStay, OtherProduct

User = get_user_model()


def clean_existing_data():
    """Limpia datos previos preservando la estructura del sistema."""
    print("🧹 Limpiando base de datos previa...")
    OtherProduct.objects.all().delete()
    ResearchStay.objects.all().delete()
    AcademicEvent.objects.all().delete()
    Publication.objects.all().delete()
    Evidence.objects.all().delete()
    ThesisProgress.objects.all().delete()
    AgreementAuditLog.objects.all().delete()
    Agreement.objects.all().delete()
    TutoringParticipant.objects.all().delete()
    TutoringSession.objects.all().delete()
    AcademicCommittee.objects.all().delete()
    Semester.objects.all().delete()
    Student.objects.all().delete()
    User.objects.all().delete()
    print("✓ Base de datos limpia.")


@transaction.atomic
def run_seed():
    print("🌱 Iniciando población de datos maestros en N.E.X.U.S...")
    clean_existing_data()

    today = timezone.now().date()

    # =========================================================================
    # 1. USUARIOS DE ADMINISTRACIÓN Y COORDINACIÓN
    # =========================================================================
    print("\n[1/7] Creando Administrador y Coordinador...")
    admin_user = User.objects.create_superuser(
        email='admin@nexus.edu',
        password='Admin1234!',
        first_name='Administrador',
        last_name='General',
        role='COORDINADOR'
    )
    print(f"  ✓ Admin creado: {admin_user.email} (Admin1234!)")

    coord_user = User.objects.create_user(
        email='coordinador@nexus.edu',
        password='Coord1234!',
        first_name='Dra. Sofia',
        last_name='Mendoza Ramirez',
        role='COORDINADOR',
        is_staff=True
    )
    print(f"  ✓ Coordinador creado: {coord_user.email} (Coord1234!)")

    # =========================================================================
    # 2. ASESORES DE POSGRADO (5 ASESORES)
    # =========================================================================
    print("\n[2/7] Creando 5 Asesores de Posgrado...")
    advisors_data = [
        ('roberto.hernandez@nexus.edu', 'Dr. Roberto', 'Hernández Gómez'),
        ('elena.morales@nexus.edu', 'Dra. Elena', 'Morales Rivas'),
        ('fernando.castillo@nexus.edu', 'Dr. Fernando', 'Castillo Peña'),
        ('patricia.vega@nexus.edu', 'Dra. Patricia', 'Vega Soto'),
        ('miguel.navarro@nexus.edu', 'Dr. Miguel Ángel', 'Navarro Lara'),
    ]

    advisors = []
    for email, fname, lname in advisors_data:
        adv = User.objects.create_user(
            email=email,
            password='Asesor1234!',
            first_name=fname,
            last_name=lname,
            role='ASESOR',
            is_staff=True
        )
        advisors.append(adv)
        print(f"  ✓ Asesor creado: {adv.get_full_name()} <{adv.email}>")

    # =========================================================================
    # 3. ESTUDIANTES DE DOCTORADO (10 ESTUDIANTES DISTRIBUIDOS SEMESTRES 1-6)
    # =========================================================================
    print("\n[3/7] Creando 10 Estudiantes doctorales con semestres y comités...")

    students_info = [
        # Semestre 1 (Cohorte 2026-A)
        {
            'email': 'alejandro.torres@nexus.edu',
            'first_name': 'Alejandro',
            'last_name': 'Torres Morales',
            'matricula': 'DOC-2026-001',
            'cohorte': '2026-A',
            'semestre_actual': 1,
            'advisor_idx': 0,
            'coadvisor_idx': 1,
            'vocal_idx': 2,
            'tesis_titulo': 'Arquitecturas Neuronales Profundas para Optimización Energética en Redes 6G'
        },
        {
            'email': 'beatriz.salazar@nexus.edu',
            'first_name': 'Beatriz',
            'last_name': 'Salazar Méndez',
            'matricula': 'DOC-2026-002',
            'cohorte': '2026-A',
            'semestre_actual': 1,
            'advisor_idx': 1,
            'coadvisor_idx': 2,
            'vocal_idx': 3,
            'tesis_titulo': 'Modelado Criptográfico Post-Cuántico Aplicado a Sistemas Distribuidos'
        },
        # Semestre 2 (Cohorte 2025-B)
        {
            'email': 'carlos.vargas@nexus.edu',
            'first_name': 'Carlos',
            'last_name': 'Vargas Reyes',
            'matricula': 'DOC-2025-003',
            'cohorte': '2025-B',
            'semestre_actual': 2,
            'advisor_idx': 2,
            'coadvisor_idx': 3,
            'vocal_idx': 4,
            'tesis_titulo': 'Algoritmos Bioinspirados para Diagnóstico Temprano de Enfermedades Neurodegenerativas'
        },
        {
            'email': 'diana.fuentes@nexus.edu',
            'first_name': 'Diana',
            'last_name': 'Fuentes Ortiz',
            'matricula': 'DOC-2025-004',
            'cohorte': '2025-B',
            'semestre_actual': 2,
            'advisor_idx': 3,
            'coadvisor_idx': 4,
            'vocal_idx': 0,
            'tesis_titulo': 'Plataforma de Visión Computacional para Detección de Microfisuras en Estructuras Aeronáuticas'
        },
        # Semestre 3 (Cohorte 2025-A)
        {
            'email': 'esteban.rios@nexus.edu',
            'first_name': 'Esteban',
            'last_name': 'Ríos Castro',
            'matricula': 'DOC-2025-005',
            'cohorte': '2025-A',
            'semestre_actual': 3,
            'advisor_idx': 4,
            'coadvisor_idx': 0,
            'vocal_idx': 1,
            'tesis_titulo': 'Procesamiento de Lenguaje Natural en Lenguas Originarias de Mesoamérica'
        },
        # Semestre 4 (Cohorte 2024-B)
        {
            'email': 'gabriela.montes@nexus.edu',
            'first_name': 'Gabriela',
            'last_name': 'Montes Ruiz',
            'matricula': 'DOC-2024-006',
            'cohorte': '2024-B',
            'semestre_actual': 4,
            'advisor_idx': 0,
            'coadvisor_idx': 2,
            'vocal_idx': 4,
            'tesis_titulo': 'Optimización de Celdas Fotovoltaicas mediante Síntesis de Nuevos Materiales Perovskita'
        },
        {
            'email': 'hector.navarro@nexus.edu',
            'first_name': 'Héctor',
            'last_name': 'Navarro Beltrán',
            'matricula': 'DOC-2024-007',
            'cohorte': '2024-B',
            'semestre_actual': 4,
            'advisor_idx': 1,
            'coadvisor_idx': 3,
            'vocal_idx': 0,
            'tesis_titulo': 'Control Robusto Predictivo Multivariable para Micro-Redes Eléctricas Autónomas'
        },
        # Semestre 5 (Cohorte 2024-A)
        {
            'email': 'isabel.perez@nexus.edu',
            'first_name': 'Isabel',
            'last_name': 'Pérez Guzmán',
            'matricula': 'DOC-2024-008',
            'cohorte': '2024-A',
            'semestre_actual': 5,
            'advisor_idx': 2,
            'coadvisor_idx': 4,
            'vocal_idx': 1,
            'tesis_titulo': 'Bioinformática Estructural: Descubrimiento In Sílico de Inhibidores Enzimáticos contra Arbovirus'
        },
        # Semestre 6 (Cohorte 2023-B)
        {
            'email': 'jorge.dominguez@nexus.edu',
            'first_name': 'Jorge',
            'last_name': 'Domínguez Solís',
            'matricula': 'DOC-2023-009',
            'cohorte': '2023-B',
            'semestre_actual': 6,
            'advisor_idx': 3,
            'coadvisor_idx': 0,
            'vocal_idx': 2,
            'tesis_titulo': 'Ciberseguridad Resiliente para Infraestructuras Críticas de Agua Potable y Energía'
        },
        {
            'email': 'karen.valdez@nexus.edu',
            'first_name': 'Karen',
            'last_name': 'Valdez Ibarra',
            'matricula': 'DOC-2023-010',
            'cohorte': '2023-B',
            'semestre_actual': 6,
            'advisor_idx': 4,
            'coadvisor_idx': 1,
            'vocal_idx': 3,
            'tesis_titulo': 'Aprendizaje por Refuerzo Concurrente para Enjambres de Vehículos Aéreos No Tripulados (UAV)'
        },
    ]

    # Diccionario de fechas base de semestres (año base 2026)
    # Semestres: 1=2026-A, 2=2025-B, 3=2025-A, 4=2024-B, 5=2024-A, 6=2023-B
    semester_dates = {
        1: (datetime.date(2026, 2, 1), datetime.date(2026, 7, 31)),
        2: (datetime.date(2025, 8, 1), datetime.date(2026, 1, 31)),
        3: (datetime.date(2025, 2, 1), datetime.date(2025, 7, 31)),
        4: (datetime.date(2024, 8, 1), datetime.date(2025, 1, 31)),
        5: (datetime.date(2024, 2, 1), datetime.date(2024, 7, 31)),
        6: (datetime.date(2023, 8, 1), datetime.date(2024, 1, 31)),
    }

    created_students = []

    for sdata in students_info:
        st_user = User.objects.create_user(
            email=sdata['email'],
            password='Estudiante1234!',
            first_name=sdata['first_name'],
            last_name=sdata['last_name'],
            role='ESTUDIANTE'
        )

        st_obj = Student.objects.create(
            user=st_user,
            matricula=sdata['matricula'],
            nombre_completo=f"{sdata['first_name']} {sdata['last_name']}",
            programa_doctoral='Doctorado en Ciencias en Computación y Sistemas',
            cohorte=sdata['cohorte'],
            estatus_activo=True
        )

        # Crear Semestres (del 1 al semestre_actual)
        semesters_dict = {}
        sem_act = sdata['semestre_actual']

        for num in range(1, sem_act + 1):
            # Calcular offset de fechas
            # El semestre `num` para este estudiante ocurrió hace (sem_act - num) periodos
            period_rank = sem_act - num + 1
            start_d, end_d = semester_dates.get(period_rank, (datetime.date(2023, 1, 1), datetime.date(2023, 6, 30)))
            is_active_sem = (num == sem_act)

            sem_obj = Semester.objects.create(
                student=st_obj,
                numero=num,
                fecha_inicio=start_d,
                fecha_fin=end_d,
                is_active=is_active_sem
            )
            semesters_dict[num] = sem_obj

        # Crear Miembros del Comité Tutorial (3 miembros activos)
        adv_p = advisors[sdata['advisor_idx']]
        adv_c = advisors[sdata['coadvisor_idx']]
        adv_v = advisors[sdata['vocal_idx']]

        AcademicCommittee.objects.create(
            student=st_obj,
            user=adv_p,
            rol_comite='ASESOR_PRINCIPAL',
            fecha_asignacion=semesters_dict[1].fecha_inicio,
            is_active=True
        )
        AcademicCommittee.objects.create(
            student=st_obj,
            user=adv_c,
            rol_comite='COASESOR',
            fecha_asignacion=semesters_dict[1].fecha_inicio,
            is_active=True
        )
        AcademicCommittee.objects.create(
            student=st_obj,
            user=adv_v,
            rol_comite='VOCAL',
            fecha_asignacion=semesters_dict[1].fecha_inicio,
            is_active=True
        )

        created_students.append({
            'student': st_obj,
            'user': st_user,
            'semesters': semesters_dict,
            'semestre_actual': sem_act,
            'advisor_p': adv_p,
            'advisor_c': adv_c,
            'advisor_v': adv_v,
            'tesis_titulo': sdata['tesis_titulo']
        })
        print(f"  ✓ Estudiante {st_obj.matricula} ({st_obj.nombre_completo}) - Semestre {sem_act} con Comité Tutorial asignado.")

    # =========================================================================
    # 4. SESIONES DE TUTORÍA Y ASISTENCIA
    # =========================================================================
    print("\n[4/7] Generando Sesiones de Tutoría y Asistencia...")
    
    for st_entry in created_students:
        st_obj = st_entry['student']
        sem_dict = st_entry['semesters']
        adv_p = st_entry['advisor_p']
        adv_c = st_entry['advisor_c']

        for sem_num, sem_obj in sem_dict.items():
            # Cada semestre tiene 1 o 2 sesiones de tutoría
            # Sesión 1: Mediados del semestre
            session_1_date = sem_obj.fecha_inicio + datetime.timedelta(days=45)
            # Asegurar que no sea en el futuro lejano si el semestre es actual
            if session_1_date > today:
                session_1_date = sem_obj.fecha_inicio + datetime.timedelta(days=10)

            t_session_1 = TutoringSession.objects.create(
                student=st_obj,
                semester=sem_obj,
                fecha_sesion=session_1_date,
                modalidad='PRESENCIAL' if sem_num % 2 == 1 else 'VIRTUAL',
                resumen=f"Revisión de avance del Semestre {sem_num}. Análisis metodológico y definición de experimentos clave para la tesis '{st_entry['tesis_titulo'][:40]}...'.",
                proxima_reunion_fecha=session_1_date + datetime.timedelta(days=30),
                proxima_reunion_notas="Revisar primer borrador de marco teórico y script de entrenamiento.",
                created_by=adv_p
            )
            # Participantes
            TutoringParticipant.objects.create(session=t_session_1, user=st_entry['user'], rol_en_sesion='ESTUDIANTE', asistencia=True)
            TutoringParticipant.objects.create(session=t_session_1, user=adv_p, rol_en_sesion='ASESOR_PRINCIPAL', asistencia=True)
            TutoringParticipant.objects.create(session=t_session_1, user=adv_c, rol_en_sesion='COASESOR', asistencia=True)

            # Sesión 2 si el semestre ya concluyó o si está avanzado
            if not sem_obj.is_active or (sem_obj.is_active and (today - sem_obj.fecha_inicio).days > 60):
                session_2_date = min(sem_obj.fecha_fin - datetime.timedelta(days=15), today - datetime.timedelta(days=5))
                if session_2_date > session_1_date:
                    t_session_2 = TutoringSession.objects.create(
                        student=st_obj,
                        semester=sem_obj,
                        fecha_sesion=session_2_date,
                        modalidad='HIBRIDA',
                        resumen=f"Cierre de evaluación del Semestre {sem_num}. Presentación de resultados preliminares y validación de métricas ante el comité.",
                        proxima_reunion_fecha=session_2_date + datetime.timedelta(days=45),
                        proxima_reunion_notas="Preparar reporte semestral consolidado para coordinación.",
                        created_by=adv_p
                    )
                    TutoringParticipant.objects.create(session=t_session_2, user=st_entry['user'], rol_en_sesion='ESTUDIANTE', asistencia=True)
                    TutoringParticipant.objects.create(session=t_session_2, user=adv_p, rol_en_sesion='ASESOR_PRINCIPAL', asistencia=True)

    print(f"  ✓ {TutoringSession.objects.count()} Sesiones de tutoría y {TutoringParticipant.objects.count()} registros de asistencia creados.")

    # =========================================================================
    # 5. ACUERDOS EN LOS 4 ESTADOS CON BITÁCORAS DE AUDITORÍA
    # =========================================================================
    print("\n[5/7] Generando Acuerdos en los 4 Estados (PENDIENTE, EN_PROCESO, CONCLUIDO, VENCIDO) y Bitácoras...")

    for i, st_entry in enumerate(created_students):
        st_obj = st_entry['student']
        adv_p = st_entry['advisor_p']
        sessions = list(st_obj.tutoring_sessions.all().order_by('-fecha_sesion'))
        latest_session = sessions[0] if sessions else None

        # 1. ACUERDO CONCLUIDO (Histórico)
        ag_concluido = Agreement(
            student=st_obj,
            session=latest_session,
            descripcion=f"Concluir revisión bibliográfica exhaustiva de los últimos 5 años y redactar síntesis comparativa para la tesis.",
            responsable=st_entry['user'],
            fecha_limite=today - datetime.timedelta(days=40),
            estado=Agreement.STATUS_CONCLUIDO,
            fecha_conclusion=today - datetime.timedelta(days=42),
            created_by=adv_p
        )
        ag_concluido.save()
        AgreementAuditLog.objects.create(
            agreement=ag_concluido,
            user=adv_p,
            estado_anterior='PENDIENTE',
            estado_nuevo='EN_PROCESO',
            comentario='Se comenzó la recopilación de papers en IEEE y ACM.'
        )
        AgreementAuditLog.objects.create(
            agreement=ag_concluido,
            user=adv_p,
            estado_anterior='EN_PROCESO',
            estado_nuevo='CONCLUIDO',
            comentario='Entregable revisado y aprobado satisfactoriamente.'
        )

        # 2. ACUERDO EN PROCESO (Vigente, fecha límite futura)
        ag_en_proceso = Agreement(
            student=st_obj,
            session=latest_session,
            descripcion=f"Implementar módulo computacional del modelo propuesto y generar batería de pruebas sintéticas iniciales.",
            responsable=st_entry['user'],
            fecha_limite=today + datetime.timedelta(days=20),
            estado=Agreement.STATUS_EN_PROCESO,
            created_by=adv_p
        )
        ag_en_proceso.save()
        AgreementAuditLog.objects.create(
            agreement=ag_en_proceso,
            user=st_entry['user'],
            estado_anterior='PENDIENTE',
            estado_nuevo='EN_PROCESO',
            comentario='Iniciando la fase de codificación en el clúster institucional.'
        )

        # 3. ACUERDO PENDIENTE (Nuevo, fecha límite futura)
        ag_pendiente = Agreement(
            student=st_obj,
            session=latest_session,
            descripcion=f"Redactar sección de metodología experimental y preparar poster para el coloquio doctoral de posgrado.",
            responsable=st_entry['user'],
            fecha_limite=today + datetime.timedelta(days=35),
            estado=Agreement.STATUS_PENDIENTE,
            created_by=adv_p
        )
        ag_pendiente.save()

        # 4. ACUERDO VENCIDO (Fecha límite en el pasado no concluida)
        ag_vencido = Agreement(
            student=st_obj,
            session=latest_session,
            descripcion=f"Entregar reporte técnico de calibración de hiperparámetros y script reproducible en el repositorio.",
            responsable=st_entry['user'],
            fecha_limite=today - datetime.timedelta(days=18),
            estado=Agreement.STATUS_VENCIDO,
            created_by=adv_p
        )
        ag_vencido.save()
        AgreementAuditLog.objects.create(
            agreement=ag_vencido,
            user=None,
            estado_anterior='EN_PROCESO',
            estado_nuevo='VENCIDO',
            comentario='Transición automática de estado: fecha límite superada.'
        )

    print(f"  ✓ {Agreement.objects.count()} Acuerdos creados ({Agreement.objects.filter(estado='PENDIENTE').count()} Pendientes, {Agreement.objects.filter(estado='EN_PROCESO').count()} En Proceso, {Agreement.objects.filter(estado='CONCLUIDO').count()} Concluidos, {Agreement.objects.filter(estado='VENCIDO').count()} Vencidos).")
    print(f"  ✓ {AgreementAuditLog.objects.count()} Registros de bitácora de acuerdos generados.")

    # =========================================================================
    # 6. AVANCES DE TESIS CON LOS 6 COMPONENTES ESTRUCTURADOS
    # =========================================================================
    print("\n[6/7] Registrando Avances de Tesis por Semestre (6 Componentes)...")

    # Mapeo de progreso progresivo por número de semestre
    progress_templates = {
        1: {
            'porcentaje': 15,
            'componentes': {'protocolo': 85, 'estadoArte': 40, 'marcoTeorico': 15, 'metodologia': 0, 'analisis': 0, 'redaccion': 0},
            'obs': 'Aprobación del protocolo doctoral y definición del estado del arte inicial.'
        },
        2: {
            'porcentaje': 32,
            'componentes': {'protocolo': 100, 'estadoArte': 80, 'marcoTeorico': 55, 'metodologia': 30, 'analisis': 10, 'redaccion': 5},
            'obs': 'Consolidación del marco teórico y diseño de la arquitectura metodológica.'
        },
        3: {
            'porcentaje': 50,
            'componentes': {'protocolo': 100, 'estadoArte': 95, 'marcoTeorico': 85, 'metodologia': 65, 'analisis': 35, 'redaccion': 20},
            'obs': 'Implementación de pruebas preliminares y validación experimental de base.'
        },
        4: {
            'porcentaje': 70,
            'componentes': {'protocolo': 100, 'estadoArte': 100, 'marcoTeorico': 95, 'metodologia': 85, 'analisis': 70, 'redaccion': 45},
            'obs': 'Extracción de resultados concluyentes y redacción de artículo científico principal.'
        },
        5: {
            'porcentaje': 85,
            'componentes': {'protocolo': 100, 'estadoArte': 100, 'marcoTeorico': 100, 'metodologia': 95, 'analisis': 88, 'redaccion': 75},
            'obs': 'Validación estadística comparativa y redacción de capítulos 3, 4 y 5 de la tesis.'
        },
        6: {
            'porcentaje': 96,
            'componentes': {'protocolo': 100, 'estadoArte': 100, 'marcoTeorico': 100, 'metodologia': 100, 'analisis': 98, 'redaccion': 95},
            'obs': 'Borrador completo de tesis en revisión final con el comité tutorial para trámite de grado.'
        },
    }

    for st_entry in created_students:
        st_obj = st_entry['student']
        sem_dict = st_entry['semesters']

        for sem_num, sem_obj in sem_dict.items():
            tmpl = progress_templates[sem_num]
            tp_date = min(sem_obj.fecha_fin - datetime.timedelta(days=10), today)

            ThesisProgress.objects.create(
                student=st_obj,
                semester=sem_obj,
                porcentaje_avance=tmpl['porcentaje'],
                componentes_json=tmpl['componentes'],
                observaciones=f"{tmpl['obs']} Proyecto: {st_entry['tesis_titulo']}",
                fecha_registro=tp_date
            )

    print(f"  ✓ {ThesisProgress.objects.count()} Registros de avance de tesis generados con componentes desglosados.")

    # =========================================================================
    # 7. PRODUCCIÓN ACADÉMICA Y EVIDENCIAS VINCULADAS (JCR, CONGRESOS, ESTANCIAS, PRODUCTOS)
    # =========================================================================
    print("\n[7/7] Creando Producción Académica (Publicaciones, Congresos, Estancias, Productos) y Evidencias...")

    dummy_pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Title (Evidencia Documental Posgrado N.E.X.U.S.) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF"

    for i, st_entry in enumerate(created_students):
        st_obj = st_entry['student']
        sem_dict = st_entry['semesters']
        sem_act = st_entry['semestre_actual']
        active_sem = sem_dict[sem_act]
        adv_p = st_entry['advisor_p']

        # Evidencia 1: Archivo Local (Carta / Dictamen / Constancia)
        ev_file = Evidence(
            student=st_obj,
            semester=active_sem,
            tipo=Evidence.TIPO_ARCHIVO,
            actividad_tipo=Evidence.ACTIVIDAD_TUTORIA,
            titulo=f"Constancia de Avance Académico Semestre {sem_act}",
            descripcion="Documento oficial con firma del comité tutorial avalando el avance semestral.",
            mime_type='application/pdf',
            fecha_carga=today - datetime.timedelta(days=10),
            created_by=adv_p
        )
        ev_file.archivo_adjunto.save(
            f"constancia_{st_obj.matricula}_sem{sem_act}.pdf",
            ContentFile(dummy_pdf_content),
            save=False
        )
        ev_file.save()

        # Evidencia 2: Enlace DOI
        ev_doi = Evidence.objects.create(
            student=st_obj,
            semester=active_sem,
            tipo=Evidence.TIPO_DOI,
            actividad_tipo=Evidence.ACTIVIDAD_OTRO,
            titulo=f"Enlace DOI de Publicación Científica Indexada",
            descripcion="Registro persistente del artículo en editorial internacional.",
            enlace_url=f"https://doi.org/10.1016/j.nexus.{2024 + (i % 3)}.{1000 + i}",
            fecha_carga=today - datetime.timedelta(days=25),
            created_by=st_entry['user']
        )

        # 1. Publicación (JCR / Scopus / Conacyt)
        Publication.objects.create(
            student=st_obj,
            semester=active_sem,
            titulo=f"Advanced Algorithms for {st_entry['tesis_titulo'][:60]}: A Novel Framework",
            autores_texto=f"{st_obj.nombre_completo}, {adv_p.get_full_name()}, {st_entry['advisor_c'].get_full_name()}",
            tipo=Publication.TIPO_JCR if sem_act >= 3 else Publication.TIPO_CONACYT,
            revista_editorial='IEEE Transactions on Computational Science' if sem_act >= 3 else 'Revista Mexicana de Investigación en Computación',
            estado=Publication.ESTADO_PUBLICADO if sem_act >= 4 else (Publication.ESTADO_ACEPTADO if sem_act == 3 else Publication.ESTADO_EN_REVISION),
            fecha_publicacion=today - datetime.timedelta(days=60) if sem_act >= 3 else None,
            doi_url=f"https://doi.org/10.1109/TCS.{2024 + (i % 3)}.{3000 + i}",
            evidencia=ev_doi
        )

        # 2. Evento Académico / Congreso
        AcademicEvent.objects.create(
            student=st_obj,
            semester=active_sem,
            tipo_evento=AcademicEvent.EVENTO_CONGRESO_INT if sem_act >= 3 else AcademicEvent.EVENTO_CONGRESO_NAC,
            nombre_evento='International Conference on Advanced Computing and AI (ICACAI 2025)' if sem_act >= 3 else 'Congreso Nacional de Posgrados de Excelencia',
            titulo_ponencia=f"Preliminary Results on {st_entry['tesis_titulo'][:50]}",
            fecha_presentacion=today - datetime.timedelta(days=90),
            sede_lugar='Vancouver, BC, Canadá' if sem_act >= 3 else 'Ciudad de México, México',
            modalidad='PRESENCIAL',
            evidencia=ev_file
        )

        # 3. Estancia de Investigación (Para semestres avanzados 4, 5, 6)
        if sem_act >= 4:
            ResearchStay.objects.create(
                student=st_obj,
                institucion_receptora='Politecnico di Milano - Dipartimento di Elettronica, Informazione e Bioingegneria' if i % 2 == 0 else 'Universidad Politécnica de Madrid (UPM)',
                pais='Italia' if i % 2 == 0 else 'España',
                fecha_inicio=today - datetime.timedelta(days=200),
                fecha_fin=today - datetime.timedelta(days=110),
                responsable_estancia='Prof. Dr. Marco Bertini' if i % 2 == 0 else 'Dra. Carmen Fernández Valdés',
                objetivos='Desarrollo y contrastación del modelo matemático en infraestructuras de supercómputo.',
                resultados='Validación del algoritmo con datasets reales y borrador conjunto de paper Q1.',
                evidencia=ev_file
            )

        # 4. Otro Producto (Software / Base de datos / Prototipo)
        OtherProduct.objects.create(
            student=st_obj,
            tipo_producto=OtherProduct.TIPO_SOFTWARE if i % 2 == 0 else OtherProduct.TIPO_BASE_DATOS,
            titulo=f"Toolkit {st_obj.matricula}: Open-Source Implementation",
            descripcion=f"Paquete y repositorio documentado para reproducibilidad experimental de la tesis '{st_entry['tesis_titulo']}'.",
            fecha_registro=today - datetime.timedelta(days=30),
            evidencia=ev_file
        )

    print(f"  ✓ {Evidence.objects.count()} Evidencias documentales creadas.")
    print(f"  ✓ {Publication.objects.count()} Publicaciones JCR/Conacyt creadas.")
    print(f"  ✓ {AcademicEvent.objects.count()} Congresos/Coloquios registrados.")
    print(f"  ✓ {ResearchStay.objects.count()} Estancias de investigación registradas.")
    print(f"  ✓ {OtherProduct.objects.count()} Productos académicos (Software/Bases de datos) creados.")

    print("\n" + "=" * 80)
    print("🎉 SEED DATA COMPLETADO CON ÉXITO - N.E.X.U.S. RC 1.0 POBLADO 100%")
    print("=" * 80)
    print("Resumen de Credenciales de Acceso:")
    print("  • Superadministrador: admin@nexus.edu / Admin1234!")
    print("  • Coordinador:        coordinador@nexus.edu / Coord1234!")
    print("  • Asesores (5):       roberto.hernandez@nexus.edu / Asesor1234! (y 4 más)")
    print("  • Estudiantes (10):   alejandro.torres@nexus.edu / Estudiante1234! (a karen.valdez@nexus.edu)")
    print("=" * 80)


if __name__ == '__main__':
    run_seed()

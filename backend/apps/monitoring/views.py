from datetime import timedelta
from django.utils import timezone
from django.db.models import Q
from django.apps import apps
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.exceptions import PermissionDenied, NotFound

from apps.students.models import Student
from apps.tutoring.models import TutoringSession
from apps.agreements.models import Agreement


class AlertsView(APIView):
    """
    GET /api/v2/monitoring/alerts/
    
    Identifica reactivamente:
    1. Acuerdos con estado VENCIDO o fecha_limite < hoy (no concluidos).
    2. Acuerdos por vencer (fecha_limite <= today + 5 días y estado != 'CONCLUIDO').
    3. Alumnos con seguimiento incompleto (> 60 días sin tutoría registrada o sin ninguna tutoría).
    
    Respeta el RBAC aislando por estudiante, asesor (comité asignado) o coordinador/admin.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        today = timezone.now().date()
        
        # 1. Update overdue agreements status in DB
        Agreement.objects.filter(
            fecha_limite__lt=today
        ).exclude(
            estado__in=[Agreement.STATUS_CONCLUIDO, Agreement.STATUS_VENCIDO]
        ).update(
            estado=Agreement.STATUS_VENCIDO,
            updated_at=timezone.now()
        )
        
        # Base QuerySets depending on User Role
        student_param = request.query_params.get('student')
        
        # Scope students
        if user.is_superuser or getattr(user, 'role', None) == 'COORDINADOR':
            students_qs = Student.objects.filter(estatus_activo=True)
            agreements_qs = Agreement.objects.select_related('student', 'responsable')
        elif getattr(user, 'role', None) == 'ASESOR':
            students_qs = Student.objects.filter(
                estatus_activo=True,
                committee_members__user=user,
                committee_members__is_active=True
            ).distinct()
            agreements_qs = Agreement.objects.filter(
                Q(student__committee_members__user=user, student__committee_members__is_active=True) |
                Q(responsable=user) |
                Q(created_by=user)
            ).select_related('student', 'responsable').distinct()
        elif getattr(user, 'role', None) == 'ESTUDIANTE':
            students_qs = Student.objects.filter(estatus_activo=True, user=user)
            agreements_qs = Agreement.objects.filter(
                Q(student__user=user) | Q(responsable=user)
            ).select_related('student', 'responsable').distinct()
        else:
            students_qs = Student.objects.none()
            agreements_qs = Agreement.objects.none()

        if student_param:
            students_qs = students_qs.filter(id=student_param)
            agreements_qs = agreements_qs.filter(student_id=student_param)

        alerts = []

        # A) VENCIDOS
        vencidos = agreements_qs.filter(
            Q(estado=Agreement.STATUS_VENCIDO) |
            (Q(fecha_limite__lt=today) & ~Q(estado=Agreement.STATUS_CONCLUIDO))
        ).order_by('fecha_limite')

        for ag in vencidos:
            responsable_nombre = ag.responsable.get_full_name() if hasattr(ag.responsable, 'get_full_name') and ag.responsable.get_full_name() else getattr(ag.responsable, 'email', str(ag.responsable))
            alerts.append({
                "id": f"alert-vencido-{ag.id}",
                "tipo": "VENCIDO",
                "titulo": f"Acuerdo Vencido: {ag.descripcion[:40]}",
                "mensaje": f"El acuerdo '{ag.descripcion}' asignado a {responsable_nombre} venció el {ag.fecha_limite}.",
                "severidad": "ALTA",
                "student_id": ag.student_id,
                "student_nombre": ag.student.nombre_completo,
                "fecha": str(ag.fecha_limite),
                "metadata": {
                    "agreement_id": ag.id,
                    "responsable": responsable_nombre,
                    "estado": ag.estado,
                    "fecha_limite": str(ag.fecha_limite),
                }
            })

        # B) POR VENCER (fecha_limite <= today + 5 días y fecha_limite >= today y estado != 'CONCLUIDO')
        five_days_ahead = today + timedelta(days=5)
        por_vencer = agreements_qs.filter(
            fecha_limite__gte=today,
            fecha_limite__lte=five_days_ahead
        ).exclude(
            estado=Agreement.STATUS_CONCLUIDO
        ).order_by('fecha_limite')

        for ag in por_vencer:
            dias_restantes = (ag.fecha_limite - today).days
            responsable_nombre = ag.responsable.get_full_name() if hasattr(ag.responsable, 'get_full_name') and ag.responsable.get_full_name() else getattr(ag.responsable, 'email', str(ag.responsable))
            dias_texto = "vence hoy" if dias_restantes == 0 else (f"{dias_restantes} día restante" if dias_restantes == 1 else f"{dias_restantes} días restantes")
            alerts.append({
                "id": f"alert-por-vencer-{ag.id}",
                "tipo": "POR_VENCER",
                "titulo": f"Acuerdo por Vencer: {ag.descripcion[:40]}",
                "mensaje": f"El acuerdo '{ag.descripcion}' asignado a {responsable_nombre} vencerá el {ag.fecha_limite} ({dias_texto}).",
                "severidad": "MEDIA",
                "student_id": ag.student_id,
                "student_nombre": ag.student.nombre_completo,
                "fecha": str(ag.fecha_limite),
                "metadata": {
                    "agreement_id": ag.id,
                    "responsable": responsable_nombre,
                    "dias_restantes": dias_restantes,
                    "estado": ag.estado,
                    "fecha_limite": str(ag.fecha_limite),
                }
            })

        # C) FALTA SEGUIMIENTO (> 60 días sin tutoría registrada o sin tutoría)
        for st in students_qs:
            latest_session = TutoringSession.objects.filter(student=st).order_by('-fecha_sesion').first()
            if latest_session:
                dias_sin_tutoria = (today - latest_session.fecha_sesion).days
                if dias_sin_tutoria > 60:
                    alerts.append({
                        "id": f"alert-seguimiento-{st.id}",
                        "tipo": "FALTA_SEGUIMIENTO",
                        "titulo": f"Seguimiento Incompleto: {st.nombre_completo}",
                        "mensaje": f"El estudiante {st.nombre_completo} ({st.matricula}) no registra sesiones de tutoría en los últimos {dias_sin_tutoria} días.",
                        "severidad": "ALTA" if dias_sin_tutoria > 90 else "MEDIA",
                        "student_id": st.id,
                        "student_nombre": st.nombre_completo,
                        "fecha": str(latest_session.fecha_sesion),
                        "metadata": {
                            "student_id": st.id,
                            "matricula": st.matricula,
                            "dias_sin_tutoria": dias_sin_tutoria,
                            "ultima_sesion": str(latest_session.fecha_sesion),
                        }
                    })
            else:
                alerts.append({
                    "id": f"alert-sin-tutoria-{st.id}",
                    "tipo": "FALTA_SEGUIMIENTO",
                    "titulo": f"Sin Tutorías Registradas: {st.nombre_completo}",
                    "mensaje": f"El estudiante {st.nombre_completo} ({st.matricula}) no cuenta con ninguna sesión de tutoría registrada.",
                    "severidad": "ALTA",
                    "student_id": st.id,
                    "student_nombre": st.nombre_completo,
                    "fecha": str(today),
                    "metadata": {
                        "student_id": st.id,
                        "matricula": st.matricula,
                        "dias_sin_tutoria": None,
                        "ultima_sesion": None,
                    }
                })

        return Response({
            "total_alertas": len(alerts),
            "alertas": alerts
        }, status=status.HTTP_200_OK)


class TimelineView(APIView):
    """
    GET /api/v2/monitoring/timeline/?student=<id>
    
    Recoge y unifica cronológicamente los 4 tipos de nodos:
    1. TUTORIA (📘, #6365EF)
    2. ACUERDO (📝, semáforo: PENDIENTE #57949D, EN_PROCESO #B57136, CONCLUIDO #437E5C, VENCIDO #A14D98)
    3. TESIS (📊, #2C1867)
    4. EVIDENCIA (📎, #57949D)
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        student_id = request.query_params.get('student')
        
        if not student_id:
            # If user is student, default to their student id
            if getattr(user, 'role', None) == 'ESTUDIANTE' and hasattr(user, 'student_profile'):
                student_id = user.student_profile.id
            else:
                return Response(
                    {"detail": "Parámetro 'student' es requerido."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            raise NotFound("Estudiante no encontrado.")

        # RBAC Check
        if not (user.is_superuser or getattr(user, 'role', None) == 'COORDINADOR'):
            if getattr(user, 'role', None) == 'ESTUDIANTE' and student.user != user:
                raise PermissionDenied("No tiene permisos para consultar el expediente de este estudiante.")
            elif getattr(user, 'role', None) == 'ASESOR':
                if not student.committee_members.filter(user=user, is_active=True).exists():
                    raise PermissionDenied("No es miembro del comité tutorial activo de este estudiante.")

        events = []

        # 1. TUTORIAS
        tutoring_qs = TutoringSession.objects.filter(student=student).prefetch_related(
            'participants__user', 'observations__autor', 'semester'
        ).order_by('-fecha_sesion')

        for session in tutoring_qs:
            participants_data = [
                {
                    "nombre": p.user.get_full_name() if hasattr(p.user, 'get_full_name') and p.user.get_full_name() else getattr(p.user, 'email', str(p.user)),
                    "rol": p.get_rol_en_sesion_display(),
                    "asistencia": p.asistencia,
                    "notas": p.notas
                }
                for p in session.participants.all()
            ]
            observations_data = [
                {
                    "titulo": o.titulo_tema,
                    "contenido": o.contenido,
                    "autor": o.autor.get_full_name() if hasattr(o.autor, 'get_full_name') and o.autor.get_full_name() else getattr(o.autor, 'email', str(o.autor)),
                    "created_at": o.created_at.isoformat() if o.created_at else None
                }
                for o in session.observations.all()
            ]
            events.append({
                "id": f"tutoria-{session.id}",
                "tipo": "TUTORIA",
                "titulo": f"Sesión de Tutoría ({session.get_modalidad_display()})",
                "descripcion": session.resumen,
                "fecha": str(session.fecha_sesion),
                "estado": "CONCLUIDA",
                "icono": "📘",
                "color": "#6365EF",
                "metadata": {
                    "session_id": session.id,
                    "modalidad": session.modalidad,
                    "semestre": f"Semestre {session.semester.numero}" if session.semester else None,
                    "participantes": participants_data,
                    "observaciones": observations_data,
                    "proxima_reunion_fecha": str(session.proxima_reunion_fecha) if session.proxima_reunion_fecha else None,
                    "proxima_reunion_notas": session.proxima_reunion_notas or ""
                }
            })

        # 2. ACUERDOS
        agreements_qs = Agreement.objects.filter(student=student).select_related('responsable', 'session')
        
        SEMAFORO_COLORS = {
            Agreement.STATUS_PENDIENTE: '#57949D',
            Agreement.STATUS_EN_PROCESO: '#B57136',
            Agreement.STATUS_CONCLUIDO: '#437E5C',
            Agreement.STATUS_VENCIDO: '#A14D98',
        }

        for ag in agreements_qs:
            fecha_evento = str(ag.fecha_conclusion or ag.fecha_limite)
            responsable_nombre = ag.responsable.get_full_name() if hasattr(ag.responsable, 'get_full_name') and ag.responsable.get_full_name() else getattr(ag.responsable, 'email', str(ag.responsable))
            events.append({
                "id": f"acuerdo-{ag.id}",
                "tipo": "ACUERDO",
                "titulo": f"Acuerdo: {ag.descripcion[:50]}",
                "descripcion": ag.descripcion,
                "fecha": fecha_evento,
                "estado": ag.estado,
                "icono": "📝",
                "color": SEMAFORO_COLORS.get(ag.estado, "#57949D"),
                "metadata": {
                    "agreement_id": ag.id,
                    "responsable": responsable_nombre,
                    "fecha_limite": str(ag.fecha_limite),
                    "fecha_conclusion": str(ag.fecha_conclusion) if ag.fecha_conclusion else None,
                    "session_id": ag.session_id,
                    "estado": ag.estado
                }
            })

        # 3. AVANCES DE TESIS
        try:
            ThesisProgress = apps.get_model('thesis', 'ThesisProgress')
            if ThesisProgress:
                thesis_qs = ThesisProgress.objects.filter(student=student).select_related('semester')
                for tp in thesis_qs:
                    events.append({
                        "id": f"tesis-{tp.id}",
                        "tipo": "TESIS",
                        "titulo": f"Avance de Tesis: {tp.porcentaje_avance}%",
                        "descripcion": tp.observaciones or f"Avance de tesis registrado al {tp.porcentaje_avance}%.",
                        "fecha": str(tp.fecha_registro),
                        "estado": f"{tp.porcentaje_avance}%",
                        "icono": "📊",
                        "color": "#2C1867",
                        "metadata": {
                            "progress_id": tp.id,
                            "porcentaje_avance": tp.porcentaje_avance,
                            "componentes_json": tp.componentes_json,
                            "observaciones": tp.observaciones,
                            "semestre": f"Semestre {tp.semester.numero}" if tp.semester else None
                        }
                    })
        except LookupError:
            pass

        # 4. EVIDENCIAS
        try:
            Evidence = apps.get_model('evidence', 'Evidence')
            if Evidence:
                evidence_qs = Evidence.objects.filter(student=student).select_related('semester', 'created_by')
                for ev in evidence_qs:
                    cargado_por = (ev.created_by.get_full_name() if hasattr(ev.created_by, 'get_full_name') and ev.created_by.get_full_name() else getattr(ev.created_by, 'email', str(ev.created_by))) if ev.created_by else None
                    events.append({
                        "id": f"evidencia-{ev.id}",
                        "tipo": "EVIDENCIA",
                        "titulo": f"Evidencia: {ev.titulo}",
                        "descripcion": ev.descripcion or (ev.enlace_url if ev.tipo == 'ENLACE_DOI' else "Archivo local adjunto"),
                        "fecha": str(ev.fecha_carga),
                        "estado": ev.get_tipo_display() if hasattr(ev, 'get_tipo_display') else ev.tipo,
                        "icono": "📎",
                        "color": "#57949D",
                        "metadata": {
                            "evidence_id": ev.id,
                            "tipo": ev.tipo,
                            "actividad_tipo": ev.actividad_tipo,
                            "actividad_id": ev.actividad_id,
                            "enlace_url": ev.enlace_url,
                            "archivo_url": ev.archivo_adjunto.url if ev.archivo_adjunto else None,
                            "mime_type": ev.mime_type,
                            "file_size_bytes": ev.file_size_bytes,
                            "cargado_por": cargado_por
                        }
                    })
        except LookupError:
            pass

        # Sort timeline descending by date and id
        events.sort(key=lambda x: (x["fecha"], x["id"]), reverse=True)

        return Response({
            "student_id": student.id,
            "total_eventos": len(events),
            "timeline": events
        }, status=status.HTTP_200_OK)

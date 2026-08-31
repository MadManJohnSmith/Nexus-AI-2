from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import ThesisProgress
from .serializers import ThesisProgressSerializer, ThesisProgressCreateSerializer
from apps.identity.permissions import IsAssignedAdvisorOrStudent


class ThesisProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet para la gestión y seguimiento del avance de tesis doctoral.
    Permite registrar porcentajes y componentes estructurados.
    """
    permission_classes = [IsAuthenticated, IsAssignedAdvisorOrStudent]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['student__nombre_completo', 'student__matricula', 'observaciones']
    ordering_fields = ['fecha_registro', 'porcentaje_avance', 'created_at']
    ordering = ['-fecha_registro', '-created_at']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return ThesisProgress.objects.none()

        qs = ThesisProgress.objects.select_related('student', 'semester').all()

        # Aislamiento por rol
        if not (user.is_superuser or getattr(user, 'role', None) == 'COORDINADOR'):
            if getattr(user, 'role', None) == 'ESTUDIANTE':
                qs = qs.filter(student__user=user)
            elif getattr(user, 'role', None) == 'ASESOR':
                qs = qs.filter(
                    student__committee_members__user=user,
                    student__committee_members__is_active=True
                ).distinct()
            else:
                qs = qs.none()

        # Filtros por query params
        student_id = self.request.query_params.get('student') or self.request.query_params.get('student_id')
        if student_id:
            qs = qs.filter(student_id=student_id)

        semester_id = self.request.query_params.get('semester') or self.request.query_params.get('semester_id')
        if semester_id:
            qs = qs.filter(semester_id=semester_id)

        return qs.distinct()

    def get_serializer_class(self):
        if self.action == 'create':
            return ThesisProgressCreateSerializer
        return ThesisProgressSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        response_data = {
            'thesis_progress_created_id': instance.id,
            'mensaje': 'Avance de tesis registrado correctamente',
            'thesis_progress': ThesisProgressSerializer(instance, context={'request': request}).data
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'details': 'Recurso eliminado correctamente', 'success': True},
            status=status.HTTP_200_OK
        )

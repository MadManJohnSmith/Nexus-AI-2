from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Publication
from .serializers import PublicationSerializer, PublicationCreateSerializer
from apps.identity.permissions import IsAssignedAdvisorOrStudent


class PublicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet para la gestión de publicaciones científicas (HU-17).
    """
    permission_classes = [IsAuthenticated, IsAssignedAdvisorOrStudent]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['student__nombre_completo', 'student__matricula', 'titulo', 'autores_texto', 'revista_editorial']
    ordering_fields = ['fecha_publicacion', 'created_at', 'titulo']
    ordering = ['-fecha_publicacion', '-created_at']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Publication.objects.none()

        qs = Publication.objects.select_related('student', 'semester', 'evidencia').all()

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

        tipo = self.request.query_params.get('tipo')
        if tipo:
            qs = qs.filter(tipo=tipo)

        estado = self.request.query_params.get('estado')
        if estado:
            qs = qs.filter(estado=estado)

        return qs.distinct()

    def get_serializer_class(self):
        if self.action == 'create':
            return PublicationCreateSerializer
        return PublicationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        response_data = {
            'publication_created_id': instance.id,
            'mensaje': 'Publicación registrada correctamente',
            'publication': PublicationSerializer(instance, context={'request': request}).data
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'details': 'Recurso eliminado correctamente', 'success': True},
            status=status.HTTP_200_OK
        )

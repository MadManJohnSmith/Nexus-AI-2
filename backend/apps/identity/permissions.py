from rest_framework.permissions import BasePermission


class RolePermissionBase(BasePermission):
    """
    Clase base utilitaria para validación de roles de usuario.
    Permite acceso si el usuario está autenticado y su rol está en allowed_roles
    o si es superusuario.
    """
    allowed_roles = []

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.is_superuser or getattr(request.user, 'role', None) in self.allowed_roles)
        )


class IsCoordinator(RolePermissionBase):
    """
    Permite acceso únicamente a usuarios con role == 'COORDINADOR' o is_superuser.
    """
    allowed_roles = ['COORDINADOR']


class IsAdvisor(RolePermissionBase):
    """
    Permite acceso a usuarios con role == 'ASESOR' o is_superuser.
    """
    allowed_roles = ['ASESOR']


class IsStudent(RolePermissionBase):
    """
    Permite acceso a usuarios con role == 'ESTUDIANTE' o is_superuser.
    """
    allowed_roles = ['ESTUDIANTE']


class IsAssignedAdvisorOrStudent(BasePermission):
    """
    Permite acceso si el usuario es:
    1. Superusuario o Coordinador (role == 'COORDINADOR')
    2. El propio estudiante asociado al expediente u objeto
    3. Un asesor, coasesor o miembro asignado en el comité tutorial activo del estudiante (HU-02).
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        # Coordinadores y superusuarios tienen acceso global de consulta/gestión
        if user.is_superuser or getattr(user, 'role', None) == 'COORDINADOR':
            return True

        # Determinar el objeto Student asociado
        student_obj = None

        # Si el objeto es directamente una instancia de Student (o tiene matricula y committee_members)
        if hasattr(obj, 'committee_members') and hasattr(obj, 'matricula'):
            student_obj = obj
        elif hasattr(obj, 'student') and obj.student is not None:
            student_obj = obj.student

        if student_obj is not None:
            # Verificar si el usuario autenticado es el estudiante
            if student_obj.user == user:
                return True

            # Verificar si el usuario es miembro activo del comité tutorial
            if student_obj.committee_members.filter(user=user, is_active=True).exists():
                return True

            return False

        # Si el objeto es un CustomUser
        if hasattr(obj, 'email') and hasattr(obj, 'role'):
            return obj == user

        # Si el objeto tiene relación directa 'user'
        if hasattr(obj, 'user') and obj.user is not None:
            return obj.user == user

        return False

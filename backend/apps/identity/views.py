from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.identity.serializers import CustomTokenObtainPairSerializer, UserSerializer


class LoginView(TokenObtainPairView):
    """
    POST /api/v2/auth/login/
    Autenticación con email y password, retornando tokens JWT y datos de perfil.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    """
    POST /api/v2/auth/refresh/ y /api/v2/auth/token/refresh/
    Renovación del access token mediante el refresh token.
    """
    permission_classes = [permissions.AllowAny]


class UserProfileView(APIView):
    """
    GET /api/v2/auth/me/
    Obtiene los datos del usuario autenticado.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

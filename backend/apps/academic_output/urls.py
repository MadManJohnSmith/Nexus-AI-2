from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicationViewSet, AcademicEventViewSet

router = DefaultRouter()
router.register(r'publications', PublicationViewSet, basename='publication')
router.register(r'academic-events', AcademicEventViewSet, basename='academic-event')

urlpatterns = [
    path('', include(router.urls)),
]

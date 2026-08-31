from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicationViewSet, AcademicEventViewSet, ResearchStayViewSet

router = DefaultRouter()
router.register(r'publications', PublicationViewSet, basename='publication')
router.register(r'academic-events', AcademicEventViewSet, basename='academic-event')
router.register(r'research-stays', ResearchStayViewSet, basename='research-stay')

urlpatterns = [
    path('', include(router.urls)),
]

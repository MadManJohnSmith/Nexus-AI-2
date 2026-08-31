from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v2/auth/', include('apps.identity.urls')),
    path('api/v2/students/', include('apps.students.urls')),
    path('api/v2/tutoring-sessions/', include('apps.tutoring.urls')),
    path('api/v2/agreements/', include('apps.agreements.urls')),
]

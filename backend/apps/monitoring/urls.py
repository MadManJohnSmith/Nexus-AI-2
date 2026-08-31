from django.urls import path
from .views import AlertsView, TimelineView

urlpatterns = [
    path('alerts/', AlertsView.as_view(), name='monitoring-alerts'),
    path('timeline/', TimelineView.as_view(), name='monitoring-timeline'),
]

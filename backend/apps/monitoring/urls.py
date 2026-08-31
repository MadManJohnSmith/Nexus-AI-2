from django.urls import path
from .views import AlertsView, TimelineView, CoordinatorDashboardView

urlpatterns = [
    path('alerts/', AlertsView.as_view(), name='monitoring-alerts'),
    path('timeline/', TimelineView.as_view(), name='monitoring-timeline'),
    path('coordinator-dashboard/', CoordinatorDashboardView.as_view(), name='coordinator-dashboard'),
]

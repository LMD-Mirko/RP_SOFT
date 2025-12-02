"""
URL configuration for gestion_tareas project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/v1/backlog/', include('apps.backlog.infrastructure.api.urls')),
    # path('api/v1/sprint/', include('apps.sprint.infrastructure.api.urls')),
    # path('api/v1/repo/', include('apps.historias.infrastructure.api.urls')),
    # path('api/v1/metrics/', include('apps.metricas.infrastructure.api.urls')),
    # path('api/v1/dashboard/', include('apps.dashboard.infrastructure.api.urls')),
]
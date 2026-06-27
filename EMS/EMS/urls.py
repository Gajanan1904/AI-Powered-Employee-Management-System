"""
URL configuration for EMS project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="EMS API",
        default_version='v1',
        description="Employee Management System APIs",
    ),
    public=True,
    permission_classes=[permissions.IsAdminUser],
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Employee APIs
    path('api/employees/', include('employee.urls')),

    # Attendance APIs
    path('api/attendance/', include('attendance.urls')),

    # Auth
    path('api/', include('employee.auth_urls')),  # if you created token urls separately
    
    path('api/performance/', include('performance.urls')),
    
    path('api/rewards/', include('rewards.urls')),
    
    # path('api/analytics/', include('analytics_app.urls')),
    
    path('api/analytics/', include('analytics.urls')),
    
    path('api/ai/', include('ai_prediction.urls')),
    
    path( 'swagger/',schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    
    path('face-auth/', include('face_auth.urls')),
    
    
]
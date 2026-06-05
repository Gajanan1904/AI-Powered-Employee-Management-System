from django.urls import path
from . import views

urlpatterns = [

    path('leaderboard/', views.leaderboard),

    path('low-performance/', views.low_performance),

    path('absent-employees/', views.absent_employees),

    path('department-summary/', views.department_summary),
    
    path('employee-insights/<int:id>/', views.employee_insights),
    
    path('ml-data/', views.ml_data),
]
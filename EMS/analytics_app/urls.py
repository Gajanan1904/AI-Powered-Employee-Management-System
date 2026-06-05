from django.urls import path
from . import views

urlpatterns = [
    path('leaderboard/', views.leaderboard),
    path('performance/', views.performance_analysis),
    path('attendance/', views.attendance_analysis),
]
from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_attendance),
    path('mark/', views.mark_attendance),
    path('toggle/', views.toggle_attendance),
]
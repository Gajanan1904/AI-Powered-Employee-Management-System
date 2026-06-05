from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_performance),
    path('add/', views.add_performance),
]
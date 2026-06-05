from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_employees, name='get_employees'),
    path('create/', views.create_employee, name='create_employee'),
    path('<int:pk>/', views.get_employee, name='get_employee'),
    path('update/<int:pk>/', views.update_employee, name='update_employee'),
    path('delete/<int:pk>/', views.delete_employee, name='delete_employee'),
    path('', views.get_employees),
    path('my-profile/', views.my_profile),
    path('register/', views.register_employee),
    path('my-profile/', views.my_profile),
]
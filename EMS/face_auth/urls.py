from django.urls import path
from .views import verify_face

urlpatterns = [
    path('verify/', verify_face),
]
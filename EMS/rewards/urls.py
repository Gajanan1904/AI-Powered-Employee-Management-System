from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_rewards),
    path('add/', views.add_reward),
    path('leaderboard/', views.leaderboard),
]
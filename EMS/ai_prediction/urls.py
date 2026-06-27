from django.urls import path
from .views import (
    predict_performance,
    get_prediction_history
)

urlpatterns = [
    path('predict/', predict_performance),
    path('history/', get_prediction_history),
]
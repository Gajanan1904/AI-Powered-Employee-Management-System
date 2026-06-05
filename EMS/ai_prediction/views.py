from rest_framework.decorators import api_view
from rest_framework.response import Response

from ml_model.predict import predict_employee_score


@api_view(['POST'])
def predict_performance(request):

    try:

        data = request.data

        prediction = predict_employee_score(data)

        return Response({
            'predicted_score': prediction
        })

    except Exception as e:

        return Response({
            'error': str(e)
        })
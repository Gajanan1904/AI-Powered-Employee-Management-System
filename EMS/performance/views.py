from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Performance
from .serializers import PerformanceSerializer


@api_view(['GET'])
def get_performance(request):
    performance = Performance.objects.select_related('employee')
    serializer = PerformanceSerializer(performance, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def add_performance(request):
    serializer = PerformanceSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Attendance
from .serializers import AttendanceSerializer


# GET all attendance
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_attendance(request):
    records = Attendance.objects.all()

    employee_id = request.GET.get('employee')
    date = request.GET.get('date')

    if employee_id:
        records = records.filter(employee_id=employee_id)

    if date:
        records = records.filter(date=date)

    serializer = AttendanceSerializer(records, many=True)
    return Response(serializer.data)


# POST attendance (Admin only)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_attendance(request):
    if not request.user.is_staff:
        return Response({'error': 'Only admin can mark attendance'})

    serializer = AttendanceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)
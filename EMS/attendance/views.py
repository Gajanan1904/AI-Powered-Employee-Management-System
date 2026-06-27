from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Attendance
from .serializers import AttendanceSerializer


# GET all attendance
@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def get_attendance(request):
    records = Attendance.objects.select_related('employee').order_by('-date', 'employee__id')[:300]

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
#@permission_classes([IsAuthenticated])
def mark_attendance(request):
    if not request.user.is_staff:
        return Response({'error': 'Only admin can mark attendance'})

    serializer = AttendanceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['POST'])
def toggle_attendance(request):

    print("REQUEST DATA:", request.data)

    employee_id = request.data.get('id')
    status = request.data.get('status')

    print("EMPLOYEE ID:", employee_id)
    print("STATUS:", status)

    try:
        attendance = Attendance.objects.filter(
            employee_id=employee_id
        ).latest('date')

        attendance.status = status
        attendance.save()

        serializer = AttendanceSerializer(attendance)

        return Response(serializer.data)

    except Attendance.DoesNotExist:
        return Response(
            {"error": "Attendance record not found"},
            status=404
        )
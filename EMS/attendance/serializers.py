from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):

    name = serializers.CharField(
        source='employee.name',
        read_only=True
    )

    department = serializers.CharField(
        source='employee.department',
        read_only=True
    )

    employee_id = serializers.CharField(
        source='employee.employee_id',
        read_only=True
    )

    attendanceRate = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = [
            'id',
            'employee',
            'employee_id',
            'name',
            'department',
            'date',
            'status',
            'attendanceRate'
        ]

    def get_attendanceRate(self, obj):

        total_records = Attendance.objects.filter(
            employee=obj.employee
        ).count()

        if total_records == 0:
            return 0

        present_records = Attendance.objects.filter(
            employee=obj.employee,
            status='Present'
        ).count()

        return round(
            (present_records / total_records) * 100,
            2
        )
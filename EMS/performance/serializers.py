from rest_framework import serializers
from .models import Performance


class PerformanceSerializer(serializers.ModelSerializer):

    employee_name = serializers.CharField(
        source='employee.name',
        read_only=True
    )

    department = serializers.CharField(
        source='employee.department',
        read_only=True
    )

    designation = serializers.CharField(
        source='employee.designation',
        read_only=True
    )

    class Meta:
        model = Performance
        fields = [
            'id',
            'employee',
            'employee_name',
            'department',
            'designation',
            'teamwork',
            'communication',
            'innovation',
            'task_completion',
            'final_score',
            'remarks',
            'evaluation_date'
        ]
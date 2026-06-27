from rest_framework import serializers
from .models import Employee
from attendance.models import Attendance
from performance.models import Performance


class EmployeeSerializer(serializers.ModelSerializer):

    attendanceRate = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    performanceScore = serializers.SerializerMethodField()
    teamwork = serializers.SerializerMethodField()
    communication = serializers.SerializerMethodField()
    innovation = serializers.SerializerMethodField()
    taskCompletion = serializers.SerializerMethodField()
    rewardPoints = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id',
            'employee_id',
            'name',
            'email',
            'role',
            'department',
            'salary',
            'date_joined',
            'designation',
            'attendanceRate',
            'status',
            'performanceScore',
            'teamwork',
            'communication',
            'innovation',
            'taskCompletion',
            'rewardPoints'
        ]

    def get_attendanceRate(self, obj):

        total_records = Attendance.objects.filter(
            employee=obj
        ).count()

        if total_records == 0:
            return 0

        present_records = Attendance.objects.filter(
            employee=obj,
            status='Present'
        ).count()

        return round(
            (present_records / total_records) * 100,
            2
        )

    def get_status(self, obj):

        latest_record = Attendance.objects.filter(
            employee=obj
        ).order_by('-date').first()

        if latest_record:
            return latest_record.status

        return "No Record"
    
    def get_performanceScore(self, obj):

        latest_performance = Performance.objects.filter(
            employee=obj
    ).order_by('-evaluation_date').first()

        if latest_performance:
            return latest_performance.final_score

        return 0
    
    def get_teamwork(self, obj):

        perf = Performance.objects.filter(
            employee=obj
        ).order_by('-evaluation_date').first()

        if perf:
            return perf.teamwork

        return 0


    def get_communication(self, obj):

        perf = Performance.objects.filter(
            employee=obj
        ).order_by('-evaluation_date').first()

        if perf:
            return perf.communication

        return 0


    def get_innovation(self, obj):

        perf = Performance.objects.filter(
            employee=obj
        ).order_by('-evaluation_date').first()

        if perf:
            return perf.innovation

        return 0


    def get_taskCompletion(self, obj):

        perf = Performance.objects.filter(
            employee=obj
        ).order_by('-evaluation_date').first()

        if perf:
            return perf.task_completion

        return 0

    def get_rewardPoints(self, obj):
        from rewards.models import Reward
        reward = Reward.objects.filter(employee=obj).first()
        if reward:
            return reward.reward_points
        return 0
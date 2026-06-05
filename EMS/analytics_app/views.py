from rest_framework.decorators import api_view
from rest_framework.response import Response
from performance.models import Performance
from rewards.models import Reward
from attendance.models import Attendance
from django.db.models import Avg, Sum


@api_view(['GET'])
def leaderboard(request):
    top_employees = Reward.objects.values(
        'employee__name'
    ).annotate(
        total_points=Sum('reward_points')
    ).order_by('-total_points')

    return Response(top_employees)


@api_view(['GET'])
def performance_analysis(request):
    performance = Performance.objects.values(
        'employee__name'
    ).annotate(
        average_score=Avg('score')
    ).order_by('-average_score')

    return Response(performance)


@api_view(['GET'])
def attendance_analysis(request):
    attendance = Attendance.objects.values(
        'employee__name',
        'status'
    )

    return Response(attendance)
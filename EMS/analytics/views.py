from rest_framework.decorators import api_view
from rest_framework.response import Response

from performance.models import Performance
from attendance.models import Attendance
from employee.models import Employee

from django.db.models import Avg

from rewards.models import Reward
from django.db.models import Avg


# Top Performers Leaderboard
@api_view(['GET'])
def leaderboard(request):

    top_employees = Performance.objects.order_by('-final_score')[:5]

    data = []

    for emp in top_employees:
        data.append({
            'employee': emp.employee.name,
            'final_score': emp.final_score
        })

    return Response(data)


# Low Performance Employees
@api_view(['GET'])
def low_performance(request):

    low_employees = Performance.objects.filter(final_score__lt=50)

    data = []

    for emp in low_employees:
        data.append({
            'employee': emp.employee.name,
            'final_score': emp.final_score
        })

    return Response(data)


# Absent Employees
@api_view(['GET'])
def absent_employees(request):

    absent = Attendance.objects.filter(status='Absent')

    data = []

    for emp in absent:
        data.append({
            'employee': emp.employee.name,
            'date': emp.date
        })

    return Response(data)


# Department Average Salary
@api_view(['GET'])
def department_summary(request):

    departments = Employee.objects.values('department').annotate(
        avg_salary=Avg('salary')
    )

    return Response(departments)

@api_view(['GET'])
def employee_insights(request, id):

    try:
        employee = Employee.objects.get(id=id)

        attendance_count = Attendance.objects.filter(
            employee=employee,
            status='Present'
        ).count()

        avg_score = Performance.objects.filter(
            employee=employee
        ).aggregate(Avg('final_score'))

        rewards = Reward.objects.filter(
            employee=employee
        )

        total_points = sum(r.reward_points for r in rewards)

        # Performance Label
        score = avg_score['final_score__avg'] or 0

        if score >= 80:
            status = "Excellent"

        elif score >= 50:
            status = "Average"

        else:
            status = "Poor"

        data = {
            'employee': employee.name,
            'department': employee.department,
            'attendance_count': attendance_count,
            'average_score': score,
            'reward_points': total_points,
            'performance_status': status
        }

        return Response(data)

    except Employee.DoesNotExist:

        return Response({
            'error': 'Employee not found'
        })
        
        
@api_view(['GET'])

def ml_data(request):

    employees = Performance.objects.all()

    data = []

    for emp in employees:

        attendance_count = Attendance.objects.filter(
            employee=emp.employee,
            status='Present'
        ).count()

        rewards = Reward.objects.filter(
            employee=emp.employee
        )

        total_rewards = sum(r.reward_points for r in rewards)

        data.append({

            'employee': emp.employee.name,

            'department': emp.employee.department,

            'attendance': attendance_count,

            'communication': emp.communication,

            'teamwork': emp.teamwork,

            'innovation': emp.innovation,

            'task_completion': emp.task_completion,

            'final_score': emp.final_score,

            'reward_points': total_rewards

        })

    return Response(data)
from rest_framework.decorators import api_view
from rest_framework.response import Response

from performance.models import Performance
from attendance.models import Attendance
from employee.models import Employee

from django.db.models import Avg

from rewards.models import Reward
from django.db.models import Avg

from datetime import date, timedelta


# Top Performers Leaderboard
@api_view(['GET'])
def leaderboard(request):

    top_employees = Performance.objects.order_by('-final_score')[:5]

    data = []

    for emp in top_employees:
        data.append({
            'id': emp.employee.id,
            'name': emp.employee.name,
            'department': emp.employee.department,
            'designation': emp.employee.designation,
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
            'id': emp.employee.id,
            'name': emp.employee.name,
            'department': emp.employee.department,
            'designation': emp.employee.designation,
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

    departments = Performance.objects.values(
        'employee__department'
    ).annotate(
        avg_score=Avg('final_score')
    )

    data = []

    for dept in departments:
        data.append({
            "department": dept['employee__department'],
            "avg_score": round(dept['avg_score'], 2)
        })

    return Response(data)

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


@api_view(['GET'])
def get_activities(request):

    activities = [
        {
            "id": 1,
            "text": "Employee records synchronized successfully",
            "time": "Just now",
            "type": "system"
        },
        {
            "id": 2,
            "text": "Performance analytics updated",
            "time": "5 mins ago",
            "type": "system"
        },
        {
            "id": 3,
            "text": "Attendance report generated",
            "time": "15 mins ago",
            "type": "attendance"
        }
    ]

    return Response(activities)

@api_view(['GET'])
def attendance_trend(request):

    labels = []
    data = []

    for i in range(6, -1, -1):

        day = date.today() - timedelta(days=i)

        total = Attendance.objects.filter(
            date=day
        ).count()

        present = Attendance.objects.filter(
            date=day,
            status='Present'
        ).count()

        percentage = 0

        if total > 0:
            percentage = round(
                (present / total) * 100
            )

        labels.append(day.strftime("%a"))
        data.append(percentage)

    return Response({
        "labels": labels,
        "data": data
    })
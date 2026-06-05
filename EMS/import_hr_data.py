import os
import django
import pandas as pd
from datetime import date

# Django Setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EMS.settings')
django.setup()

# Import Models
from employee.models import Employee
from attendance.models import Attendance
from performance.models import Performance
from rewards.models import Reward

# Read CSV Dataset
df = pd.read_csv(r'D:\EMS\EMS\dataset\hr_dataset_v2.csv')

# Loop through rows
for index, row in df.iterrows():

    # Create Employee
    employee, created = Employee.objects.get_or_create(
        email=row['email'],
        defaults={

            'employee_id': row['employee_id'],
            'name': row['employee_name'],
            'department': row['department'],
            'designation': row['designation'],
            'salary': row['salary'],
            'role': 'employee'
        }
    )

    # Attendance Logic
    attendance_days = int(row['attendance'])

    if attendance_days >= 26:
        attendance_status = 'Present'

    elif attendance_days >= 20:
        attendance_status = 'Leave'

    else:
        attendance_status = 'Absent'

    Attendance.objects.create(
        employee=employee,
        date=date.today(),
        status=attendance_status
    )

    # Performance Entry
    Performance.objects.create(

        employee=employee,

        communication=row['communication'],
        teamwork=row['teamwork'],
        innovation=row['innovation'],
        task_completion=row['task_completion'],

        final_score=row['final_score'],

        remarks=row['remarks']
    )

    # Reward Logic
    badge = row['badge']

    if badge == 'Gold':
        bonus = 10000

    elif badge == 'Silver':
        bonus = 5000

    else:
        bonus = 2000

    Reward.objects.create(

        employee=employee,

        reward_points=row['reward_points'],

        bonus=bonus,

        badge=badge,

        remarks='Imported from HR Dataset'
    )

print("HR Dataset Imported Successfully!")
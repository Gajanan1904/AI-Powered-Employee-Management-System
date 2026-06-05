import os
import django
import pandas as pd

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EMS.settings')
django.setup()

# Import Models
from employee.models import Employee
from attendance.models import Attendance
from performance.models import Performance
from rewards.models import Reward

# Read Excel File
df = pd.read_excel(r'D:\EMS\EMS\Employee_data\Employee_Full_Data.xlsx')

# Convert all column names to lowercase
df.columns = df.columns.str.lower()

# Loop through each row
for index, row in df.iterrows():

    # Create Employee
    employee, created = Employee.objects.get_or_create(
        email=row['email'],
        defaults={
            'name': row['name'],
            'department': row['department'],
            'role': 'employee',
            'salary': row['salary']
        }
    )

    # Attendance Entry
    Attendance.objects.create(
        employee=employee,
        date='2026-05-15',
        status=row['attendance']
    )

    # Performance Entry
    Performance.objects.create(
        employee=employee,
        task_name="Assigned Task",
        task_status="Completed",
        score=row['score'],
        deadline='2026-06-01'
    )

    # Reward Logic
    if row['reward'] == 'Gold':
        points = 100
        bonus = 10000

    elif row['reward'] == 'Silver':
        points = 70
        bonus = 5000

    else:
        points = 40
        bonus = 2000

    # Reward Entry
    Reward.objects.create(
        employee=employee,
        reward_points=points,
        bonus=bonus,
        badge=row['reward'],
        remarks="Imported from Excel Dataset"
    )

print("Data Imported Successfully!")
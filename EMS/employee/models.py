from django.db import models
from django.contrib.auth.models import User

class Employee(models.Model):
    ROLE_CHOICES = (
    ('admin', 'Admin'),
    ('hr', 'HR'),
    ('employee', 'Employee'),
)
    employee_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=100, choices=ROLE_CHOICES, default='employee')

    department = models.CharField(max_length=100)

    salary = models.DecimalField(max_digits=10, decimal_places=2)

    date_joined = models.DateField(auto_now_add=True)
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    designation = models.CharField(max_length=100)

    def __str__(self):
        return self.name
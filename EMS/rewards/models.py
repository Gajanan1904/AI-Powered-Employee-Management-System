from django.db import models
from employee.models import Employee


class Reward(models.Model):
    BADGE_CHOICES = (
        ('Bronze', 'Bronze'),
        ('Silver', 'Silver'),
        ('Gold', 'Gold'),
    )

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    reward_points = models.IntegerField()
    bonus = models.DecimalField(max_digits=10, decimal_places=2)
    badge = models.CharField(max_length=20, choices=BADGE_CHOICES)
    remarks = models.TextField()

    def __str__(self):
        return f"{self.employee.name} - {self.badge}"
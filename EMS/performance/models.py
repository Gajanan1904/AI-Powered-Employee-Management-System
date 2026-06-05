from django.db import models
from employee.models import Employee


class Performance(models.Model):

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)

    task_completion = models.IntegerField()

    teamwork = models.IntegerField()

    communication = models.IntegerField()

    innovation = models.IntegerField()

    final_score = models.FloatField()

    remarks = models.TextField()

    evaluation_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.employee.name
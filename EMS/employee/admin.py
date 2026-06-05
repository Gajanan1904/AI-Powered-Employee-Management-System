from django.contrib import admin
from .models import Employee

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'role', 'department', 'salary', 'date_joined')
    search_fields = ('name', 'email', 'department')
    list_filter = ('role', 'department')
    ordering = ('-date_joined',)
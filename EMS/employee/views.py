from urllib import request

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Employee
from .serializers import EmployeeSerializer
from django.contrib.auth.models import User

def is_admin(user):
    return user.is_staff

def is_hr(employee):
    return employee.role == 'hr'


# GET all employees
@api_view(['GET'])

def get_employees(request):
    employees = Employee.objects.all().order_by('id')
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)


# POST new employee (Admin only)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_employee(request):
    employee = Employee.objects.get(user=request.user)

    if not (request.user.is_staff or employee.role == 'hr'):
        return Response({'error': 'Access denied'})

    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


# GET single employee
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employee(request, pk):
    try:
        employee = Employee.objects.get(pk=pk)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'})

    serializer = EmployeeSerializer(employee)
    return Response(serializer.data)


# UPDATE employee (Admin only)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_employee(request, pk):
    if not request.user.is_staff:
        return Response({'error': 'Only admin can update employees'})

    try:
        employee = Employee.objects.get(pk=pk)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'})

    serializer = EmployeeSerializer(employee, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


# DELETE employee (Admin only)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_employee(request, pk):
    if not request.user.is_staff:
        return Response({'error': 'Only admin can delete'})

    try:
        employee = Employee.objects.get(pk=pk)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'})

    employee.delete()
    return Response({'message': 'Deleted successfully'})

from rest_framework.permissions import IsAuthenticated
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_profile(request):

    try:
        employee = Employee.objects.get(user=request.user)

        data = {
            'name': employee.name,
            'email': employee.email,
            'department': employee.department,
            'role': employee.role,
            'salary': employee.salary
        }

        return Response(data)

    except Employee.DoesNotExist:

        return Response({
            'error': 'Employee profile not found'
        })
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_employee(request):

    try:
        if not request.user.is_staff:
            return Response({
        'error': 'Only admin can register employees'
    })

        username = request.data['username']
        password = request.data['password']

        # Create User
        user = User.objects.create_user(
            username=username,
            password=password
        )

        # Create Employee
        employee = Employee.objects.create(
            user=user,
            name=request.data['name'],
            email=request.data['email'],
            department=request.data['department'],
            role='employee',
            salary=request.data['salary']
        )

        return Response({
            'message': 'Employee Registered Successfully'
        })

    except Exception as e:

        return Response({
            'error': str(e)
        })
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])

def my_profile(request):

    employee = Employee.objects.get(user=request.user)

    serializer = EmployeeSerializer(employee)

    return Response(serializer.data)
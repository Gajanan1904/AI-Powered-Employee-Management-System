from rest_framework import serializers
from .models import Reward

class RewardSerializer(serializers.ModelSerializer):

    employee_name = serializers.CharField(
        source='employee.name',
        read_only=True
    )

    class Meta:
        model = Reward
        fields = [
            'id',
            'employee',
            'employee_name',
            'reward_points',
            'bonus',
            'badge',
            'remarks'
        ]
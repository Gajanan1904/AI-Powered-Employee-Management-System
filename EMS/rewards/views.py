from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Reward
from .serializers import RewardSerializer


@api_view(['GET'])
#@permission_classes([IsAuthenticated])

def get_rewards(request):

    rewards = Reward.objects.all()

    serializer = RewardSerializer(rewards, many=True)

    return Response(serializer.data)


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def add_reward(request):

    employee_id = request.data.get('employee')
    points = int(request.data.get('reward_points', 0))

    reward = Reward.objects.filter(employee_id=employee_id).first()

    if reward:
        reward.reward_points += points
        reward.save()

        serializer = RewardSerializer(reward)
        return Response(serializer.data)

    serializer = RewardSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)



@api_view(['GET'])
def leaderboard(request):

    rewards = Reward.objects.select_related('employee').order_by('-reward_points')

    data = []

    for reward in rewards:
        data.append({
            "id": reward.employee.id,
            "name": reward.employee.name,
            "rewardPoints": reward.reward_points,
            "badge": reward.badge,
            "department": reward.employee.department
        })

    return Response(data)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Reward
from .serializers import RewardSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])

def get_rewards(request):

    rewards = Reward.objects.all()

    serializer = RewardSerializer(rewards, many=True)

    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])

def add_reward(request):

    serializer = RewardSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save()

        return Response(serializer.data)

    return Response(serializer.errors)
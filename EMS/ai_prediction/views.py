from rest_framework.decorators import api_view
from rest_framework.response import Response

from ml_model.predict import predict_employee_score

prediction_history = []


@api_view(['POST'])
def predict_performance(request):
    
    print("AI PREDICT CALLED")

    try:

        data = request.data

        score = predict_employee_score(data)

        promotion_probability = min(99, round(score))

        churn_risk = max(1, round(100 - score))

        if score >= 90:
            badge = "Top Performer"
            trajectory = "High Growth"
        elif score >= 75:
            badge = "Rising Star"
            trajectory = "Growth Track"
        elif score >= 60:
            badge = "Consistent Contributor"
            trajectory = "Stable Performance"
        else:
            badge = "Needs Improvement"
            trajectory = "At Risk"

        result = {
            "id": len(prediction_history) + 1,
            "employeeName": data.get("employeeName"),
            "department": data.get("department"),
            "designation": data.get("designation"),
            "score": round(score, 2),
            "promotionProbability": promotion_probability,
            "churnRisk": churn_risk,
            "badgeRecommendation": badge,
            "trajectory": trajectory,
            "timestamp": "Just Now"
        }

        prediction_history.insert(0, result)
        
        print(prediction_history)

        return Response(result)

    except Exception as e:
        print("ERROR:", str(e))

        return Response({
            "error": str(e)
        })


@api_view(['GET'])
def get_prediction_history(request):

    return Response(prediction_history)
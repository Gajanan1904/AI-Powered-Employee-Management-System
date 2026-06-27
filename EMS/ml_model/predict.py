import joblib
import pandas as pd

model = joblib.load('ml_model/saved_model/employee_model.pkl')



def predict_employee_score(data):

    print("INPUT DATA:", data)

    model_input = pd.DataFrame([{
        'attendance': float(data['attendance']),
        'communication': float(data['communication']),
        'teamwork': float(data['teamwork']),
        'innovation': float(data['innovation']),
        'task_completion': float(data['taskCompletion']),
        'reward_points': float(data['rewardPoints'])
    }])

    print("MODEL INPUT:")
    print(model_input)

    prediction = model.predict(model_input)

    print("RAW PREDICTION:", prediction)

    return round(prediction[0], 2)
import joblib
import pandas as pd
from pathlib import Path

# Absolute path to the saved model
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "saved_model" / "employee_model.pkl"

# Load model once when Django starts
model = joblib.load(MODEL_PATH)


def predict_employee_score(data):
    try:
        model_input = pd.DataFrame([{
            "attendance": float(data["attendance"]),
            "communication": float(data["communication"]),
            "teamwork": float(data["teamwork"]),
            "innovation": float(data["innovation"]),
            "task_completion": float(data["taskCompletion"]),
            "reward_points": float(data["rewardPoints"])
        }])

        prediction = model.predict(model_input)

        return round(float(prediction[0]), 2)

    except Exception as e:
        raise Exception(f"Prediction Error: {str(e)}")
import joblib
import pandas as pd

# Load Saved Model
model = joblib.load('ml_model/saved_model/employee_model.pkl')

def predict_employee_score(data):

    input_data = pd.DataFrame([data])

    prediction = model.predict(input_data)

    return round(prediction[0], 2)
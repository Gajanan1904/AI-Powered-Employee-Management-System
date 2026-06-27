import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error
import joblib

# Load Dataset
df = pd.read_csv('../dataset/hr_dataset_v2.csv')


# Convert column names to lowercase
df.columns = df.columns.str.lower()
df['attendance'] = (df['attendance'] / 29) * 100

print("\nTOP 20 BY REWARD POINTS")
print(
    df[['attendance','communication','teamwork',
        'innovation','task_completion',
        'reward_points','final_score']]
    .sort_values(by='reward_points', ascending=False)
    .head(20)
)


# Features
X = df[[
    'attendance',
    'communication',
    'teamwork',
    'innovation',
    'task_completion',
    'reward_points'
]]

# Target
y = df['final_score']

# Split Data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train Model
model = RandomForestRegressor()

model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Accuracy Check
error = mean_absolute_error(y_test, y_pred)

print(f"Mean Absolute Error: {error:.2f}")

# Save Model
joblib.dump(model, 'saved_model/employee_model.pkl')

print("ML Model Trained Successfully!")

print("Model Saved Successfully!")
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error
import joblib

# Load Dataset
df = pd.read_csv('dataset/hr_dataset_v2.csv')

# Convert column names to lowercase
df.columns = df.columns.str.lower()

# Encode categorical columns
le_department = LabelEncoder()
le_designation = LabelEncoder()
le_badge = LabelEncoder()

df['department'] = le_department.fit_transform(df['department'])

df['designation'] = le_designation.fit_transform(df['designation'])

df['badge'] = le_badge.fit_transform(df['badge'])

# Features
X = df[[
    'attendance',
    'communication',
    'teamwork',
    'innovation',
    'task_completion',
    'reward_points',
    'department',
    'designation',
    'badge'
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
joblib.dump(model, 'ml_model/saved_model/employee_model.pkl')

print("ML Model Trained Successfully!")

print("Model Saved Successfully!")
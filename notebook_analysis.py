# notebook/notebook_analysis.py
import pandas as pd
import os
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import mean_squared_error, r2_score

output_dir = "../dashboard/public/data"
os.makedirs(output_dir, exist_ok=True)   # auto-create folder
# Read dataset
df = pd.read_csv('synthetic_students.csv')

# Basic EDA
print(df.describe())

# Correlation
cols = ['comprehension','attention','focus','retention','engagement_time','assessment_score']
corr = df[cols].corr()
print("\nCorrelation:\n", corr)

plt.figure(figsize=(8,6))
sns.heatmap(corr, annot=True, cmap='coolwarm')
plt.title('Correlation between skills and assessment_score')
plt.savefig('eda_correlation_heatmap.png', bbox_inches='tight')

# Scatter plot example
plt.figure(figsize=(6,4))
plt.scatter(df['attention'], df['assessment_score'], alpha=0.6)
plt.xlabel('Attention')
plt.ylabel('Assessment Score')
plt.title('Attention vs Assessment Score')
plt.savefig('attention_vs_score.png', bbox_inches='tight')

# Features & target
X = df[['comprehension','attention','focus','retention','engagement_time']]
y = df['assessment_score']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Random Forest
model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
print('RMSE:', np.sqrt(mean_squared_error(y_test, y_pred)))
print('R2:', r2_score(y_test, y_pred))

# Feature importance
importances = pd.Series(model.feature_importances_, index=X.columns).sort_values(ascending=False)
print('Feature importances:\\n', importances)

# Cross-validated R2
scores = cross_val_score(model, X, y, cv=5, scoring='r2')
print('CV R2 scores:', scores, 'Mean:', np.mean(scores))

# Clustering -> personas
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Choose k=3 (you can plot elbow to check)
k = 3
km = KMeans(n_clusters=k, random_state=42, n_init=10)
labels = km.fit_predict(X_scaled)
df['persona'] = labels

# Map persona id to human readable labels (simple method)
persona_map = {0: 'Persona A', 1: 'Persona B', 2: 'Persona C'}
df['persona_label'] = df['persona'].map(persona_map)

# Persona summary
print(df.groupby('persona_label')[['comprehension','attention','focus','retention','engagement_time','assessment_score']].mean())

# Save file for dashboard
df.to_csv('../dashboard/public/data/synthetic_students_with_persona.csv', index=False)
print('Saved synthetic_students_with_persona.csv for dashboard.')

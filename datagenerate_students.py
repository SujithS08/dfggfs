
import pandas as pd
import numpy as np
import random
from faker import Faker

fake = Faker()
Faker.seed(42)
np.random.seed(42)
random.seed(42)

N = 300

rows = []
classes = ['6A','6B','7A','7B','8A','8B','9A','9B']
for i in range(1, N+1):
    student_id = f"S{i:04d}"
    name = fake.name()
    class_name = random.choice(classes)
    comprehension = np.clip(np.random.normal(70, 12), 30, 100)
    attention = np.clip(np.random.normal(65, 15), 20, 100)
    focus = np.clip(np.random.normal(68, 14), 25, 100)
    retention = np.clip(np.random.normal(67, 13), 25, 100)
    engagement_time = np.clip(np.random.normal(45, 20), 5, 120)
    # Make assessment_score correlated with skills (plus noise)
    assessment_score = (
        0.28*comprehension + 0.26*attention + 0.2*focus + 0.16*retention + 0.1*(engagement_time/1.2)
        + np.random.normal(0, 6)
    )
    assessment_score = np.clip(assessment_score, 0, 100)
    rows.append({
        'student_id': student_id,
        'name': name,
        'class': class_name,
        'comprehension': round(float(comprehension),2),
        'attention': round(float(attention),2),
        'focus': round(float(focus),2),
        'retention': round(float(retention),2),
        'engagement_time': round(float(engagement_time),2),
        'assessment_score': round(float(assessment_score),2)
    })

df = pd.DataFrame(rows)
df.to_csv('synthetic_students.csv', index=False)
print('Created synthetic_students.csv with', len(df), 'rows')

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multioutput import MultiOutputRegressor
from sklearn.linear_model import Ridge
from sklearn.pipeline import make_pipeline
from sklearn.metrics import mean_absolute_error

training_set = pd.read_csv("cleaned_amazon_reviews.csv")
review = training_set["cleaned_review"]
emotion_names = ["fear", "anger", "trust", "surprise", "sadness", "disgust", "joy"]
emotions = training_set[emotion_names].values
non_zero_mask = ~np.all(emotions == 0, axis=1)
review = review[non_zero_mask]
emotions = emotions[non_zero_mask]
X_train, X_test, y_train, y_test = train_test_split(review, emotions, test_size=0.15, random_state=42)



tfidf = TfidfVectorizer(ngram_range=(1,2), max_features=30000)
ridge = MultiOutputRegressor(Ridge(alpha=1.0))
pipe = make_pipeline(tfidf, ridge)
pipe.fit(X_train, y_train)

y_pred = pipe.predict(X_test)
y_true = np.array(y_test)
y_pred = np.squeeze(y_pred)
y_pred = np.clip(y_pred, 0, 1)

for text, pred, true in zip(X_test, y_pred, y_true):
    print("REVIEW:", text)
    for name, p, t in zip(emotion_names, pred, true):
        print(f"  {name:9s} Pred: {p:.3f}  True: {t:.3f}")
    print()
print("MAE per emotion:", mean_absolute_error(y_test, y_pred, multioutput='raw_values'))
print("Mean MAE:", mean_absolute_error(y_test, y_pred))
mean_values = y_train.mean(axis=0)
baseline_pred = np.tile(mean_values, (len(y_test), 1))

print("Baseline MAE:", mean_absolute_error(y_test, baseline_pred))
corr = np.corrcoef(y_test.flatten(), y_pred.flatten())[0,1]
print("Correlation:", corr)


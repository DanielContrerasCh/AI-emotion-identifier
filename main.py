import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multioutput import MultiOutputRegressor
from sklearn.linear_model import Ridge
from sklearn.pipeline import make_pipeline
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import GridSearchCV

def predict_emotions(text, model, emotion_names):
    y_pred = model.predict([text])

    y_pred = np.clip(y_pred, 0, None)
    y_pred = y_pred / y_pred.sum(axis=1, keepdims=True) #normalizes predictions (always add up to 1 total.)

    return dict(zip(emotion_names, y_pred[0]))

#preprocessing, normalizes training data
training_set = pd.read_csv("cleaned_amazon_reviews.csv")
review = training_set["cleaned_review"]
emotion_names = ["fear", "anger", "trust", "surprise", "sadness", "disgust", "joy"]
emotions = training_set[emotion_names].values
non_zero_mask = ~np.all(emotions == 0, axis=1)
review = review[non_zero_mask]
emotions = emotions[non_zero_mask]
row_sums = emotions.sum(axis=1, keepdims=True)
emotions = emotions / row_sums
X_train = review
y_train = emotions


tfidf = TfidfVectorizer(ngram_range=(1,2), max_features=50000)
ridge = MultiOutputRegressor(Ridge(alpha = 0.6)) # alpha optimized through gridsearch
pipe = make_pipeline(tfidf, ridge)
pipe.fit(X_train, y_train)

while True:
    user_text = input("\nEnter a review (or 'q' to exit):\n> ")
    if user_text.lower() == "q":
        break

    emotions_pred = predict_emotions(user_text, pipe, emotion_names)

    print("\nPredicted emotions:")
    for emotion, score in sorted(
        emotions_pred.items(), key=lambda x: x[1], reverse=True
    ):
        print(f"  {emotion:9s}: {score:.3f}")
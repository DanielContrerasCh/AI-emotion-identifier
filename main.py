import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multioutput import MultiOutputRegressor
from sklearn.linear_model import Ridge
from sklearn.pipeline import make_pipeline
from sklearn.metrics import mean_absolute_error

training_set = pd.read_csv("cleaned_amazon_reviews.csv", nrows=20)
review = training_set["cleaned_review"]
emotions = training_set[["fear", "anger", "anticip", "trust", "surprise", "sadness", "disgust", "joy"]].values
X_train, X_test, y_train, y_test = train_test_split(review, emotions, test_size=0.15, random_state=42)
emotion_names = ["fear", "anger", "anticip", "trust", "surprise", "sadness", "disgust", "joy"]


tfidf = TfidfVectorizer(ngram_range=(1,2), max_features=30000)
ridge = MultiOutputRegressor(Ridge(alpha=1.0))
pipe = make_pipeline(tfidf, ridge)
pipe.fit(X_train, y_train)

y_pred = pipe.predict(X_test)
y_true = np.array(y_test)
y_pred = np.squeeze(y_pred)

for text, pred, true in zip(X_test, y_pred, y_true):
    print("REVIEW:", text)
    for name, p, t in zip(emotion_names, pred, true):
        print(f"  {name:9s} Pred: {p:.3f}  True: {t:.3f}")
    print()
print("MAE per emotion:", mean_absolute_error(y_test, y_pred, multioutput='raw_values'))
print("Mean MAE:", mean_absolute_error(y_test, y_pred))

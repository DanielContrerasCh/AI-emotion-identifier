import numpy as np
import joblib
from fastapi import FastAPI
from pydantic import BaseModel

# Load trained model
pipe = joblib.load("emotion_model.joblib")

emotion_names = ["fear", "anger", "trust", "surprise", "sadness", "disgust", "joy"]

app = FastAPI()

class TextInput(BaseModel):
    text: str


@app.post("/predict")
def predict(input: TextInput):
    y_pred = pipe.predict([input.text])

    y_pred = np.clip(y_pred, 0, None)
    y_pred = y_pred / y_pred.sum(axis=1, keepdims=True)

    return {
        emotion: float(score)
        for emotion, score in zip(emotion_names, y_pred[0])
    }
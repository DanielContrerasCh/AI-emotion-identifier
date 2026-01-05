import numpy as np
import joblib
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Load trained model
pipe = joblib.load("emotion_model.joblib")

emotion_names = ["fear", "anger", "trust", "surprise", "sadness", "disgust", "joy"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(input: TextInput):
    y_pred = pipe.predict([input.text])

    y_pred = np.clip(y_pred, 0, None)
    y_pred = y_pred / y_pred.sum(axis=1, keepdims=True)

    return {
        emotion: float(score)
        for emotion, score in zip(emotion_names, y_pred[0])
    }

if __name__ == "__main__":
    uvicorn.run("modelAPI:app", host="0.0.0.0", port=8000, reload=False)
import numpy as np
import joblib
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import re

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

def _word_count(text: str) -> int:
    if not text:
        return 0
    # split on whitespace, count non-empty tokens
    return len([t for t in re.split(r"\s+", text.strip()) if t])

@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(input: TextInput):
    # server-side word-count validation: require at least 20 words
    if _word_count(input.text) < 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input must contain at least 20 words for reliable prediction."
        )

    y_pred = pipe.predict([input.text])

    y_pred = np.clip(y_pred, 0, None)
    y_pred = y_pred / y_pred.sum(axis=1, keepdims=True)

    return {
        emotion: float(score)
        for emotion, score in zip(emotion_names, y_pred[0])
    }

if __name__ == "__main__":
    uvicorn.run("modelAPI:app", host="0.0.0.0", port=8000, reload=False)
import React, { useState } from "react";
import EmotionAnalyzer from "./components/molecules/EmotionAnalyzer";
import EmotionGrid from "./components/molecules/EmotionGrid";

export default function App() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">AI Emotion Identifier</h1>
        <p className="subtitle">Escribe una reseña para analizar emociones</p>

        <EmotionAnalyzer onAnalyze={(emotions) => setAnalysis(emotions)} />

        
      </div>
      {analysis && (
          <div style={{ marginTop: 16 }}>
            <EmotionGrid emotions={analysis} />
          </div>
        )}
    </div>
  );
}

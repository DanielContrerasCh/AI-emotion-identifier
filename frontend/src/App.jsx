import React, { useState } from "react";
import EmotionAnalyzer from "./components/molecules/EmotionAnalyzer";
import EmotionGrid from "./components/molecules/EmotionGrid";
import TopBar from "./components/organisms/TopBar";

export default function App() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <div className="app">
      <TopBar />
      <div className="card">
        <h1 className="title">AI Emotion Identifier</h1>
        <p className="subtitle">Input a review to analyze the emotions</p>

        <EmotionAnalyzer onAnalyze={(emotions) => setAnalysis(emotions)} />

        {analysis && (
          <div style={{ marginTop: 16 }}>
            <EmotionGrid emotions={analysis} />
          </div>
        )}
      </div>
    </div>
  );
}

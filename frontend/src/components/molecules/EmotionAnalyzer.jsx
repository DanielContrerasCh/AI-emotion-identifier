import React, { useState } from "react";
import TextInput from "../../components/atoms/TextInput";

export default function EmotionAnalyzer({ onAnalyze }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(null);

  function handleSubmit(e) {
    e?.preventDefault();
    if (!text.trim()) return;
    const hardcoded = {
      fear: 0.12,
      anger: 0.08,
      anticip: 0.34,
      trust: 0.46,
      surprise: 0.18,
      positive: 0.52,
      negative: 0.09,
      sadness: 0.07,
      disgust: 0.02,
      joy: 0.58,
    };
    setSubmitted({ text: text.trim(), emotions: hardcoded });
    if (typeof onAnalyze === "function") onAnalyze(hardcoded);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="controls">
        <TextInput
          placeholder="Escribe aquí..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div style={{ height: 12 }} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="submit-btn">Analizar</button>
        </div>
      </form>

      {submitted && (
        <div className="submitted">
          <strong>Reseña enviada:</strong>
          <p>{submitted.text}</p>
        </div>
      )}
    </>
  );
}

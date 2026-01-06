import React, { useState } from "react";
import TextInput from "../../components/atoms/TextInput";

export default function EmotionAnalyzer({ onAnalyze }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitBtnStyle = {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(22,163,74,0.18)",
  };

  async function handleSubmit(e) {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please enter some text.");
      return;
    }
    // client-side word count validation: require at least 20 words
    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length < 20) {
      setError("Please enter at least 20 words for a reliable analysis.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = "http://localhost:8000/predict";
      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      if (!resp.ok) throw new Error(`API error ${resp.status}`);
      const emotions = await resp.json();

      setSubmitted({ text: trimmed, emotions });
      if (typeof onAnalyze === "function") onAnalyze(emotions);
    } catch (err) {
      setError("Failed to analyze — using local fallback.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="controls">
        <TextInput
          placeholder="Type here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div style={{ height: 12 }} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" style={submitBtnStyle} disabled={loading}>
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </form>

      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}

      {submitted && (
        <div className="submitted">
          <strong>Submitted review:</strong>
          <p>{submitted.text}</p>
        </div>
      )}
    </>
  );
}

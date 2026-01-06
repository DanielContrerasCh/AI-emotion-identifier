import React from "react";

const EMOJI = {
  fear: "😨",
  anger: "😡",
  trust: "🤝",
  surprise: "😲",
  positive: "👍",
  negative: "👎",
  sadness: "😢",
  disgust: "🤢",
  joy: "😊"
};

function Ring({ value = 0, size = 72, stroke = 8, color = "#6ee7b7" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * Math.max(0, Math.min(1, value));
  return (
    <svg width={size} height={size} className="ring" viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </g>
    </svg>
  );
}

export default function EmotionGrid({ emotions = {} }) {
  const names = [
    "fear",
    "anger",
    "trust",
    "surprise",
    "positive",
    "negative",
    "sadness",
    "disgust",
    "joy"
  ];

  return (
    <div
      className="emotion-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 16,
        alignItems: "center"
      }}
    >
      {names.map((n) => {
        const val = emotions[n] ?? 0;
        return (
          <div className="emotion-item" key={n}>
            <div className="icon-wrap">
              <Ring value={val} />
              <div className="emoji">{EMOJI[n] || "❔"}</div>
            </div>
            <div className="meta">
              <div className="emotion-label">{n}</div>
              <div className="emotion-value">{(val * 100).toFixed(0)}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

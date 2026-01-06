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
  joy: "😊",
  others: "🔸" // icon for grouped small emotions
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

  // separate main (>5%) and small (<=5% but >0) emotions
  const mainVisible = names.filter((n) => (emotions[n] ?? 0) > 0.05);
  const small = names.filter((n) => {
    const v = emotions[n] ?? 0;
    return v > 0 && v <= 0.05;
  });
  const othersSum = small.reduce((s, n) => s + (emotions[n] ?? 0), 0);

  // build visible list and include "others" if applicable
  const visible = [...mainVisible];
  if (othersSum > 0) visible.push("others");

  return (
    <div
      className="emotion-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(5, Math.max(1, visible.length))}, 1fr)`,
        gap: 16,
        alignItems: "center"
      }}
    >
      {visible.map((n) => {
        const val = n === "others" ? othersSum : emotions[n] ?? 0;
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

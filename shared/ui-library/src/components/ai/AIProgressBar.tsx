import React from "react";
import './AIProgressBar.css';

export const AIProgressBar: React.FC<{ value: number; max?: number }> = ({ value, max = 100 }) => (
  <div className="ai-progress-bar glassmorphism">
    <div className="ai-progress-track">
      <div
        className="ai-progress-fill"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
    <span className="ai-progress-label">{Math.round((value / max) * 100)}%</span>
  </div>
);

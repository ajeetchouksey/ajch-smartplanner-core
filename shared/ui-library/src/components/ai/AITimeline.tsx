import React from "react";
import './AITimeline.css';

export interface TimelineStep {
  label: string;
  completed?: boolean;
}

export const AITimeline: React.FC<{ steps: TimelineStep[] }> = ({ steps }) => (
  <div className="ai-timeline glassmorphism">
    {steps.map((step, i) => (
      <div key={i} className={`ai-timeline-step${step.completed ? " completed" : ""}`}>
        <span className="ai-timeline-dot" />
        <span className="ai-timeline-label">{step.label}</span>
        {i < steps.length - 1 && <span className="ai-timeline-line" />}
      </div>
    ))}
  </div>
);

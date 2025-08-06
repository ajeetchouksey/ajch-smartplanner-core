import React from "react";
import './AILoader.css';

export const AILoader: React.FC = () => (
  <div className="ai-loader">
    <div className="ai-loader-neural">
      <div className="ai-loader-node" />
      <div className="ai-loader-node" />
      <div className="ai-loader-node" />
      <div className="ai-loader-node" />
    </div>
    <span className="ai-loader-label">Loading AI...</span>
  </div>
);

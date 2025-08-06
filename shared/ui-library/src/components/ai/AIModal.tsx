import React from "react";
import './AIModal.css';

export const AIModal: React.FC<{ open: boolean; onClose: () => void; title?: string; children: React.ReactNode }> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="ai-modal-overlay">
      <div className="ai-modal glassmorphism">
        <div className="ai-modal-header">
          <span>{title}</span>
          <button className="ai-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="ai-modal-content">{children}</div>
      </div>
    </div>
  );
};

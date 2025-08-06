import React from "react";
import './AvatarCard.css';

export const AvatarCard: React.FC<{ name: string; avatarUrl: string; status?: "online" | "offline" }> = ({ name, avatarUrl, status = "online" }) => (
  <div className="ai-avatar-card glassmorphism">
    <div className={`ai-avatar-ring ${status}`}> 
      <img src={avatarUrl} alt={name} className="ai-avatar-img" />
    </div>
    <div className="ai-avatar-info">
      <div className="ai-avatar-name">{name}</div>
      <div className={`ai-avatar-status ${status}`}>{status === "online" ? "● Online" : "○ Offline"}</div>
    </div>
  </div>
);

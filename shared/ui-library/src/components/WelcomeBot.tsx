import React from "react";

interface WelcomeBotProps {
  appName: string;
  quickActions: { label: string; onClick: () => void }[];
}

export const WelcomeBot: React.FC<WelcomeBotProps> = ({ appName, quickActions }) => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    padding: 40,
    maxWidth: 400,
    margin: "60px auto"
  }}>
    <div style={{ fontSize: 56, marginBottom: 16 }}>🤖</div>
    <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24 }}>Welcome!</h2>
    <div style={{ color: "#444", margin: "12px 0 24px 0", textAlign: "center" }}>
      I’m Aarya, your AI Planning Buddy for <b>{appName}</b>.<br />How can I help you get started?
    </div>
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
      {quickActions.map((action, i) => (
        <button
          key={i}
          onClick={action.onClick}
          style={{
            background: "#181c2f",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
          }}
        >
          {action.label}
        </button>
      ))}
    </div>
  </div>
);

import React from "react";

export const TopMenu: React.FC = () => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#181c2f",
    color: "#fff",
    padding: "12px 32px",
    fontSize: "1rem"
  }}>
    <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
      <span style={{ fontWeight: "bold", letterSpacing: 1, fontSize: "1.15em" }}>SmartPlanner</span>
      <a href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>Main</a>
      <a href="/apps/travel/" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>Travel</a>
      <a href="/apps/finance/" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>Finance</a>
      <a href="/apps/day/" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>Day Planner</a>
    </nav>
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <span id="notification-bell" style={{ display: "flex", alignItems: "center", fontSize: "1.5em", cursor: "pointer" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-5-6.32V4a1 1 0 1 0-2 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16z" fill="#fff"/>
        </svg>
      </span>
      <div id="weather-info" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span id="weather-icon" style={{ display: "flex", alignItems: "center", fontSize: "1.3em" }}>☀️</span>
        <span id="weather-text">Sunny, 32°C, Mumbai</span>
      </div>
    </div>
  </div>
);

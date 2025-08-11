
import React, { useState } from "react";
import { WelcomeBot } from "./components/WelcomeBot";
import { TopMenu } from "./components/TopMenu";
import { Footer } from "./components/Footer";


const MainDashboard = () => (
  <div style={{ background: "#f6f7fb", minHeight: "100vh", paddingTop: 64, paddingBottom: 64 }}>
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 40 }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 12 }}>SmartPlanner Dashboard</h2>
      <p style={{ color: "#444", fontSize: 18 }}>Welcome back! Here is your overall summary and quick links to all apps.</p>
      {/* ...existing dashboard content... */}
    </div>
  </div>
);

export default function MainLandingPage() {
  // Simulate first-time user with localStorage (replace with real auth/user logic)
  const [isFirstTime, setIsFirstTime] = useState(() => {
    const flag = localStorage.getItem("main_first_time");
    return flag !== "false";
  });

  const handleQuickAction = (action: string) => {
    setIsFirstTime(false);
    localStorage.setItem("main_first_time", "false");
    // Optionally route or trigger action
    alert(`Action: ${action}`);
  };

  if (isFirstTime) {
    return (
      <>
        <TopMenu />
        <div style={{ background: "#f6f7fb", minHeight: "100vh", paddingTop: 64, paddingBottom: 64 }}>
          <WelcomeBot
            appName="SmartPlanner"
            quickActions={[
              { label: "Show me how to use SmartPlanner", onClick: () => handleQuickAction("show_help") },
              { label: "Explore Features", onClick: () => handleQuickAction("explore_features") },
            ]}
          />
        </div>
        <Footer />
      </>
    );
  }
  return (
    <>
      <TopMenu />
      <MainDashboard />
      <Footer />
    </>
  );
}

import React, { useState } from "react";
import { WelcomeBot } from "../../shared/ui-library/src/components/WelcomeBot";
import { TopMenu } from "../../shared/ui-library/src/components/TopMenu";
import { Footer } from "../../shared/ui-library/src/components/Footer";


const TravelDashboard = () => (
  <div style={{ background: "#f6f7fb", minHeight: "100vh", paddingTop: 64, paddingBottom: 64 }}>
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 40, background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 12 }}>Travel Dashboard</h2>
      <p style={{ color: "#444", fontSize: 18 }}>Welcome back! Here is your travel summary and upcoming trips.</p>
      {/* ...existing dashboard content... */}
    </div>
  </div>
);

export default function TravelLandingPage() {
  // Simulate first-time user with localStorage (replace with real auth/user logic)
  const [isFirstTime, setIsFirstTime] = useState(() => {
    const flag = localStorage.getItem("travel_first_time");
    return flag !== "false";
  });

  const handleQuickAction = (action: string) => {
    setIsFirstTime(false);
    localStorage.setItem("travel_first_time", "false");
    // Optionally route or trigger action
    alert(`Action: ${action}`);
  };

  if (isFirstTime) {
    return (
      <>
        <TopMenu />
        <div style={{ background: "#f6f7fb", minHeight: "100vh", paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ maxWidth: 400, margin: "60px auto", background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 40 }}>
            <WelcomeBot
              appName="Travel"
              quickActions={[
                { label: "Plan a Trip", onClick: () => handleQuickAction("plan_trip") },
                { label: "Show Travel Tips", onClick: () => handleQuickAction("travel_tips") },
              ]}
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }
  return (
    <>
      <TopMenu />
      <TravelDashboard />
      <Footer />
    </>
  );
}

// npx vite --config vite.smartplanner.config.ts
http://localhost:3001/smartplanner.html


import React, { useState } from "react";
import { WelcomeBot } from "../../shared/ui-library/src/components/WelcomeBot";
import { TopMenu } from "../../shared/ui-library/src/components/TopMenu";
import { Footer } from "../../shared/ui-library/src/components/Footer";


const FinanceDashboard = () => (
  <div style={{ background: "#f6f7fb", minHeight: "100vh", paddingTop: 64, paddingBottom: 64 }}>
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 40, background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 12 }}>Finance Dashboard</h2>
      <p style={{ color: "#444", fontSize: 18 }}>Welcome back! Here is your finance summary and recent activity.</p>
      {/* ...existing dashboard content... */}
    </div>
  </div>
);

export default function FinanceLandingPage() {
  // Simulate first-time user with localStorage (replace with real auth/user logic)
  const [isFirstTime, setIsFirstTime] = useState(() => {
    const flag = localStorage.getItem("finance_first_time");
    return flag !== "false";
  });

  const handleQuickAction = (action: string) => {
    setIsFirstTime(false);
    localStorage.setItem("finance_first_time", "false");
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
              appName="Finance"
              quickActions={[
                { label: "Add an Expense", onClick: () => handleQuickAction("add_expense") },
                { label: "Show Finance Tips", onClick: () => handleQuickAction("finance_tips") },
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
      <FinanceDashboard />
      <Footer />
    </>
  );
}

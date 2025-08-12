import React, { useState, useEffect } from "react";
import { WelcomeBot } from "../../shared/ui-library/src/components/WelcomeBot";
import { TopMenu } from "../../shared/ui-library/src/components/TopMenu";
import { Footer } from "../../shared/ui-library/src/components/Footer";
import { LearningPlannerService } from "../../shared/ui-library/src/components/ai/LearningPlannerService";
import { ChatbotWidget } from "../../shared/ui-library/src/components/ai/ChatbotWidget";

const LearningDashboard = () => {
  const [learningPlans, setLearningPlans] = useState<any[]>([]);

  useEffect(() => {
    // Listen for learning plans from the calendar integration
    const handleAddPlan = (event: any) => {
      if (event.detail && event.detail.plan) {
        setLearningPlans(prev => [...prev, event.detail.plan]);
      }
    };

    window.addEventListener('addLearningPlanToCalendar', handleAddPlan);
    return () => window.removeEventListener('addLearningPlanToCalendar', handleAddPlan);
  }, []);

  return (
    <div style={{ background: "#f6f7fb", minHeight: "100vh", paddingTop: 64, paddingBottom: 64 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 40 }}>
        <div style={{ 
          background: "#fff", 
          borderRadius: 18, 
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: 40,
          marginBottom: 20
        }}>
          <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 12, textAlign: 'center' }}>
            🎓 Learning Planner Dashboard
          </h2>
          <p style={{ color: "#444", fontSize: 18, textAlign: 'center', marginBottom: 30 }}>
            Your AI-powered learning companion. Create personalized learning plans and track your progress.
          </p>
          
          <LearningPlannerService />
        </div>

        {learningPlans.length > 0 && (
          <div style={{ 
            background: "#fff", 
            borderRadius: 18, 
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            padding: 40
          }}>
            <h3 style={{ fontWeight: 600, fontSize: 24, marginBottom: 20 }}>
              📚 Your Active Learning Plans
            </h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              {learningPlans.map((plan, index) => (
                <div key={index} style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '12px'
                }}>
                  <h4>{plan.title}</h4>
                  <p>Duration: {plan.duration}</p>
                  <p>Next Phase: {plan.phases[0]?.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <ChatbotWidget />
    </div>
  );
};

export default function LearningLandingPage() {
  // Simulate first-time user with localStorage
  const [isFirstTime, setIsFirstTime] = useState(() => {
    const flag = localStorage.getItem("learning_first_time");
    return flag !== "false";
  });

  const handleQuickAction = (action: string) => {
    setIsFirstTime(false);
    localStorage.setItem("learning_first_time", "false");
    
    if (action === "explore_examples") {
      // This will show the examples in the main component
    } else if (action === "start_custom_plan") {
      // Direct to custom plan creation
    }
  };

  if (isFirstTime) {
    return (
      <>
        <TopMenu />
        <div style={{ background: "#f6f7fb", minHeight: "100vh", paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ maxWidth: 500, margin: "60px auto", background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 40 }}>
            <WelcomeBot
              appName="Learning Planner"
              quickActions={[
                { label: "🎯 Explore Learning Examples", onClick: () => handleQuickAction("explore_examples") },
                { label: "✨ Create Custom Learning Plan", onClick: () => handleQuickAction("start_custom_plan") },
                { label: "💬 Chat with AI Learning Assistant", onClick: () => handleQuickAction("chat_assistant") },
              ]}
            />
            <div style={{ 
              marginTop: 30, 
              padding: 20, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              borderRadius: 12, 
              color: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>🚀 Get Started Examples:</h3>
              <ul style={{ textAlign: 'left', margin: 0, paddingLeft: 20 }}>
                <li>"I want to learn Python programming in 3 months"</li>
                <li>"Help me master data science for career change"</li>
                <li>"Create a web development learning roadmap"</li>
                <li>"I need a digital marketing course plan"</li>
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopMenu />
      <LearningDashboard />
      <Footer />
    </>
  );
}

import React, { useState, useEffect } from "react";
import { WelcomeBot } from "../../shared/ui-library/src/components/WelcomeBot";
import { TopMenu } from "../../shared/ui-library/src/components/TopMenu";
import { Footer } from "../../shared/ui-library/src/components/Footer";


const DayDashboard = () => {
  const [learningTasks, setLearningTasks] = useState<any[]>([]);

  useEffect(() => {
    // Listen for learning plan integration
    const handleAddLearningPlan = (event: any) => {
      if (event.detail && event.detail.plan) {
        const plan = event.detail.plan;
        // Add first 7 days of learning tasks to calendar
        const tasksToAdd = plan.dailyTasks.slice(0, 7).map((task: any) => ({
          ...task,
          source: 'learning-planner',
          planTitle: plan.title
        }));
        setLearningTasks(prev => [...prev, ...tasksToAdd]);
        
        // Show success notification
        alert(`🎓 Learning plan "${plan.title}" added to your calendar!`);
      }
    };

    window.addEventListener('addLearningPlanToCalendar', handleAddLearningPlan);
    return () => window.removeEventListener('addLearningPlanToCalendar', handleAddLearningPlan);
  }, []);

  return (
    <div style={{ background: "#f6f7fb", minHeight: "100vh", paddingTop: 64, paddingBottom: 64 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 40, background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 12 }}>Day Planner Dashboard</h2>
        <p style={{ color: "#444", fontSize: 18, marginBottom: 30 }}>Welcome back! Here is your day plan and tasks.</p>
        
        {learningTasks.length > 0 && (
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 15, color: "#667eea" }}>
              📚 Learning Schedule (Next 7 Days)
            </h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {learningTasks.map((task, index) => (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 80px 80px',
                  gap: '15px',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                  borderRadius: '8px',
                  alignItems: 'center',
                  border: '1px solid #667eea30'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#667eea' }}>
                    {new Date(task.date).toLocaleDateString()}
                  </span>
                  <span style={{ color: '#2c3e50' }}>{task.task}</span>
                  <span style={{ fontSize: '14px', color: '#667eea', fontWeight: 600 }}>
                    {task.duration}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    padding: '4px 8px', 
                    background: '#667eea', 
                    color: 'white', 
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}>
                    {task.type}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 15, textAlign: 'center' }}>
              <button 
                onClick={() => window.location.href = '/learning'}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                🎓 Manage Learning Plans
              </button>
            </div>
          </div>
        )}
        
        <div style={{ 
          padding: 20, 
          background: '#f8f9fa', 
          borderRadius: 12,
          textAlign: 'center'
        }}>
          <h3>📅 Your Daily Schedule</h3>
          <p>Regular daily tasks and appointments will appear here.</p>
          {learningTasks.length === 0 && (
            <div style={{ marginTop: 20 }}>
              <p style={{ color: '#6c757d' }}>
                No learning plans yet. Create your first AI-powered learning plan!
              </p>
              <button 
                onClick={() => window.location.href = '/learning'}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  marginTop: 10
                }}
              >
                🎓 Start Learning Planner
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function DayLandingPage() {
  // Simulate first-time user with localStorage (replace with real auth/user logic)
  const [isFirstTime, setIsFirstTime] = useState(() => {
    const flag = localStorage.getItem("day_first_time");
    return flag !== "false";
  });

  const handleQuickAction = (action: string) => {
    setIsFirstTime(false);
    localStorage.setItem("day_first_time", "false");
    
    if (action === "learning_planner") {
      window.location.href = '/learning';
    } else {
      // Optionally route or trigger action
      alert(`Action: ${action}`);
    }
  };

  if (isFirstTime) {
    return (
      <>
        <TopMenu />
        <div style={{ background: "#f6f7fb", minHeight: "100vh", paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ maxWidth: 400, margin: "60px auto", background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 40 }}>
            <WelcomeBot
              appName="Day Planner"
              quickActions={[
                { label: "Start a New Day Plan", onClick: () => handleQuickAction("start_day_plan") },
                { label: "🎓 Create Learning Plan", onClick: () => handleQuickAction("learning_planner") },
                { label: "Show Productivity Tips", onClick: () => handleQuickAction("productivity_tips") },
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
      <DayDashboard />
      <Footer />
    </>
  );
}

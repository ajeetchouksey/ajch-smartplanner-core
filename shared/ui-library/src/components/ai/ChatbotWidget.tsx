import React, { useState } from "react";
import './ChatbotWidget.css';
import { LearningPlannerService } from './LearningPlannerService';

interface Message {
  from: 'ai' | 'user';
  text: string;
  type?: 'text' | 'action';
  action?: string;
}

export const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showLearningPlanner, setShowLearningPlanner] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      from: "ai", 
      text: "Hi! I'm your AI learning assistant. I can help you create personalized learning plans. What would you like to learn today?",
      type: "text"
    }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { from: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    
    const userInput = input.toLowerCase();
    setInput("");
    
    // Learning-related responses
    setTimeout(() => {
      let aiResponse: Message;
      
      if (userInput.includes('learn') || userInput.includes('study') || userInput.includes('course') || userInput.includes('skill')) {
        aiResponse = {
          from: "ai",
          text: "Great! I'd love to help you create a personalized learning plan. I can help you learn anything from programming to languages, from business skills to creative arts. Would you like to start with our Learning Planner?",
          type: "action",
          action: "start_learning_planner"
        };
      } else if (userInput.includes('python') || userInput.includes('programming') || userInput.includes('coding')) {
        aiResponse = {
          from: "ai",
          text: "Excellent choice! Python is a great language to learn. I can create a comprehensive learning plan that takes you from beginner to job-ready. Let's use the Learning Planner to customize your Python journey!",
          type: "action",
          action: "start_learning_planner"
        };
      } else if (userInput.includes('data science') || userInput.includes('machine learning') || userInput.includes('ai')) {
        aiResponse = {
          from: "ai",
          text: "Data Science and AI are exciting fields! I can help you create a structured learning path covering statistics, programming, machine learning, and practical projects. Ready to start planning?",
          type: "action",
          action: "start_learning_planner"
        };
      } else if (userInput.includes('web development') || userInput.includes('web design') || userInput.includes('frontend') || userInput.includes('backend')) {
        aiResponse = {
          from: "ai",
          text: "Web development is in high demand! I can help you plan a learning path for both frontend and backend development, including modern frameworks and best practices. Let's create your web dev roadmap!",
          type: "action",
          action: "start_learning_planner"
        };
      } else if (userInput.includes('plan') || userInput.includes('schedule') || userInput.includes('time')) {
        aiResponse = {
          from: "ai",
          text: "I specialize in creating personalized learning plans! Tell me what you want to learn, how much time you have, and your goals. I'll create a detailed day-by-day plan that fits your schedule.",
          type: "action",
          action: "start_learning_planner"
        };
      } else {
        aiResponse = {
          from: "ai",
          text: "I'm your AI learning assistant! I can help you create personalized learning plans for any subject. Just tell me what you'd like to learn, and I'll create a structured plan with daily tasks, milestones, and timeline. Would you like to try the Learning Planner?",
          type: "action",
          action: "start_learning_planner"
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
    }, 700);
  };

  const handleAction = (action: string) => {
    if (action === 'start_learning_planner') {
      setShowLearningPlanner(true);
    }
  };

  return (
    <>
      <div className={`ai-chatbot-widget${open ? " open" : ""}`}>
        <button className="ai-chatbot-toggle" onClick={() => setOpen(!open)}>
          <span className="ai-neural-bubble" />
          <span className="ai-chatbot-icon">🎓</span>
        </button>
        {open && !showLearningPlanner && (
          <div className="ai-chatbot-window glassmorphism">
            <div className="ai-chatbot-header">
              AI Learning Assistant
              <button 
                className="ai-chatbot-close" 
                onClick={() => setOpen(false)}
                style={{ float: 'right', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <div className="ai-chatbot-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`ai-chatbot-msg ${msg.from}`}>
                  {msg.text}
                  {msg.type === 'action' && msg.action && (
                    <button 
                      className="ai-action-button"
                      onClick={() => handleAction(msg.action!)}
                      style={{
                        display: 'block',
                        marginTop: '8px',
                        padding: '8px 16px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      🎓 Start Learning Planner
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="ai-chatbot-input-row">
              <input
                className="ai-chatbot-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="What do you want to learn?"
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <button className="ai-chatbot-send" onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
      
      {showLearningPlanner && (
        <div className="learning-planner-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <button
              onClick={() => setShowLearningPlanner(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '20px',
                zIndex: 10001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            <LearningPlannerService />
          </div>
        </div>
      )}
    </>
  );
}

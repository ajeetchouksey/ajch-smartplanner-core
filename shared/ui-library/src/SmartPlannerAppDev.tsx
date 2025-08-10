import React, { useState, createContext, useContext } from 'react';
import { themePalettes } from './theme-palettes';
// Theme context for palette switching
const ThemeContext = createContext({
  theme: themePalettes[2].colors,
});

const useTheme = () => useContext(ThemeContext);
import SummaryCard from './components/SummaryCard';
/// <reference types="react" />
import 'react';
import type { ReactNode } from 'react';
import * as ReactNamespace from 'react';
import { ThemeProvider } from './themes/ThemeProvider';
import { Button, Heading, Text, Header, Badge, Avatar } from './components/atoms';
import './App.css';
import './styles/ai-modern.css';
import './styles/light-theme-fixes.css';

// Mock Auth Context for Development
interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'microsoft' | 'google' | 'facebook';
}

interface MockAuthState {
  isAuthenticated: boolean;
  user: MockUser | null;
  isLoading: boolean;
  error: string | null;
}

interface MockAuthContextType {
  state: MockAuthState;
  logout: () => void;
}

const MockAuthContext = React.createContext<MockAuthContextType | undefined>(undefined);

// Mock user data for development
const mockUser: MockUser = {
  id: 'dev-user-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
  provider: 'google'
};

const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state] = useState<MockAuthState>({
    isAuthenticated: true,
    user: mockUser,
    isLoading: false,
    error: null,
  });

  const logout = () => {
    console.log('Mock logout - would normally clear authentication');
    alert('This is a development version. Logout functionality is disabled.');
  };

  return (
    <MockAuthContext.Provider value={{ state, logout }}>
      {children}
    </MockAuthContext.Provider>
  );
};

// Mock useAuth hook for development
export const useMockAuth = (): MockAuthContextType => {
  const context = React.useContext(MockAuthContext);
  if (!context) {
    throw new Error('useMockAuth must be used within MockAuthProvider');
  }
  return context;
};

// AI Chat Assistant Component - Aarya (Fixed Bottom Panel)
export const AaryaAIAssistant: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    sender: 'ai' | 'user';
    time: string;
  }>>([
    { id: 1, text: "Hi! I'm Aarya, your AI assistant. How can I help you today?", sender: 'ai' as const, time: '09:30' },
    { id: 2, text: "I can help you with planning, scheduling, analytics, and any questions about SmartPlanner features.", sender: 'ai' as const, time: '09:31' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you with that.",
        "I can definitely assist you with your planning needs.",
        "Here's what I recommend based on your request...",
        "Let me analyze that for you and provide the best solution.",
        "I'll help you optimize your workflow for better productivity."
      ];
      
      const aiResponse = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'ai' as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(0,0,0,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(102,126,234,0.3)',
      transition: 'all 0.3s ease'
    }}>
      {/* Expanded Chat Area */}
      {isExpanded && (
        <div style={{
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '1rem 2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%'
          }}>
            {messages.map((message) => (
              <div key={message.id} style={{
                display: 'flex',
                justifyContent: message.sender === 'ai' ? 'flex-start' : 'flex-end'
              }}>
                <div style={{
                  maxWidth: '60%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: message.sender === 'ai' 
                    ? 'linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))'
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: message.sender === 'ai' ? '1px solid rgba(102,126,234,0.3)' : 'none',
                  position: 'relative'
                }}>
                  <Text style={{ fontSize: '14px', lineHeight: '1.4', marginBottom: '4px' }}>
                    {message.text}
                  </Text>
                  <Text style={{ 
                    fontSize: '11px', 
                    color: 'rgba(255,255,255,0.7)',
                    display: 'block'
                  }}>
                    {message.time}
                  </Text>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions Bar */}
          <div style={{
            padding: '0.75rem 2rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            gap: '1rem',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            flexWrap: 'wrap'
          }}>
            {[
              { text: "Help with planning", emoji: "📋" },
              { text: "Show analytics", emoji: "📊" },
              { text: "Create new plan", emoji: "➕" },
              { text: "Schedule review", emoji: "📅" },
              { text: "View insights", emoji: "💡" }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(action.text)}
                style={{
                  background: 'rgba(102,126,234,0.1)',
                  border: '1px solid rgba(102,126,234,0.3)',
                  borderRadius: '20px',
                  padding: '0.5rem 1rem',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {action.emoji} {action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Chat Bar */}
      <div style={{
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* AI Avatar and Status */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '12px',
            transition: 'all 0.2s ease',
            background: isExpanded ? 'rgba(102,126,234,0.1)' : 'transparent'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            position: 'relative'
          }}
          className="neural-pulse"
          >
            🤖
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '12px',
              height: '12px',
              background: '#43e97b',
              borderRadius: '50%',
              border: '2px solid rgba(0,0,0,0.8)'
            }} />
          </div>
          <div>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
              Aarya the AI powered Planning Buddy
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
              🟢 Online • Click to {isExpanded ? 'minimize' : 'expand'} chat
            </Text>
          </div>
        </div>

        {/* Chat Input */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask Aarya anything... (Press Enter to send)"
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '25px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              backdropFilter: 'blur(10px)'
            }}
          />
          <Button
            onClick={sendMessage}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            ➤
          </Button>
        </div>

        {/* Expand/Collapse Button */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(102,126,234,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '1px solid rgba(102,126,234,0.3)'
          }}
        >
          <Text style={{ color: 'white', fontSize: '14px' }}>
            {isExpanded ? '▼' : '▲'}
          </Text>
        </div>
      </div>
    </div>
  );
};

// AI Card Component matching your design system
const AICard: React.FC<{ title: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ 
  title, 
  children, 
  className = '',
  style = {}
}) => {
  return (
    <div className={`ai-card glassmorphism ${className}`} style={{ marginBottom: '1.5rem', ...(style as React.CSSProperties) }}>
      <Heading level="h3" size="lg" className="ai-heading" style={{ marginBottom: '1rem' }}>
        {title}
      </Heading>
      {children}
    </div>
  );
};

// Quick Stats Card with AI styling
const QuickStatsCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
}> = ({ title, value, subtitle, icon, color }) => (
  <div className="ai-card glassmorphism" style={{ 
    padding: '1.5rem', 
    textAlign: 'center',
    background: `linear-gradient(135deg, ${color}15, rgba(255,255,255,0.05))`,
    border: `1px solid ${color}30`
  }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
    <Heading level="h4" size="lg" className="ai-heading" style={{ marginBottom: '0.25rem' }}>
      {value}
    </Heading>
    <Text size="sm" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '0.25rem' }}>
      {title}
    </Text>
    <Text size="xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
      {subtitle}
    </Text>
  </div>
);

// Plan Item Component
const PlanItem: React.FC<{
  title: string;
  progress: number;
  dueDate: string;
  category: string;
  status: 'active' | 'completed' | 'draft';
}> = ({ title, progress, dueDate, category, status }) => {
  const statusColors = {
    active: '#4ade80',
    completed: '#06b6d4', 
    draft: '#f59e0b'
  };

  return (
    <div className="glassmorphism" style={{ 
      padding: '1rem', 
      marginBottom: '0.75rem',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '0.25rem' }}>
            {title}
          </Text>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ 
              background: 'rgba(102,126,234,0.2)', 
              color: '#667eea',
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              fontWeight: '500'
            }}>
              {category}
            </span>
            <span style={{ 
              background: `${statusColors[status]}20`, 
              color: statusColors[status],
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              fontWeight: '500'
            }}>
              {status}
            </span>
          </div>
        </div>
        <Text size="xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Due {dueDate}
        </Text>
      </div>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <Text size="xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Progress</Text>
          <Text size="xs" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>{progress}%</Text>
        </div>
        <div style={{ 
          width: '100%', 
          height: '6px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            borderRadius: '3px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  );
};

// Development Dashboard that uses your design system
const DevDashboard: React.FC = () => {
  // Set default to 'Midnight & Neon' (index 2)
  const [theme] = useState(themePalettes[2].colors);
  React.useEffect(() => {
    Object.entries(themePalettes[2].colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--sp-${key}`, value);
    });
  }, []);
  const { state, logout } = useMockAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const mockUserData = {
    name: state.user?.name || 'User',
    email: state.user?.email || '',
    avatar: state.user?.avatar,
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    console.log('Navigate to:', page);
  };

  const mockPlans = [
    {
      title: 'Complete Q1 Marketing Campaign',
      progress: 75,
      dueDate: 'Aug 15',
      category: 'Work',
      status: 'active' as const
    },
    {
      title: 'Learn React Advanced Patterns',
      progress: 40,
      dueDate: 'Aug 20',
      category: 'Learning',
      status: 'active' as const
    },
    {
      title: 'Plan Family Vacation to Japan',
      progress: 20,
      dueDate: 'Sep 1',
      category: 'Travel',
      status: 'draft' as const
    },
    {
      title: 'Health & Fitness Goals',
      progress: 85,
      dueDate: 'Aug 25',
      category: 'Health',
      status: 'active' as const
    }
  ];

  return (
    <ThemeContext.Provider value={{ theme }}>
    <div className="neural-network-bg particle-field" style={{ minHeight: '100vh', position: 'relative', background: 'var(--sp-background)' }}>
      {/* Development Banner */}
      <div style={{ 
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(90deg, #f59e0b, #d97706)',
        padding: '0.75rem 1rem',
        textAlign: 'center'
      }}>
        <Text size="sm" style={{ color: 'white', fontWeight: '600' }}>
          🚧 Development Mode: Authentication Bypassed - This is your SmartPlanner landing page after login
        </Text>
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        <Header
          user={mockUserData}
          currentPage={currentPage}
          onNavigate={handleNavigation}
          showSearch={true}
          showNotifications={true}
        />
      </div>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem 1rem',
        paddingBottom: '120px', // Space for fixed bottom chat
        position: 'relative',
        zIndex: 1
      }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--sp-text)' }}>
          <Heading level="h1" size="4xl" className="ai-heading" style={{ marginBottom: '0.5rem' }}>
            Welcome back, {state.user?.name}! 👋
          </Heading>
          <Text size="lg" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Here's what's happening with your plans today
          </Text>
        </div>


        {/* Quick Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem',
          color: 'var(--sp-text)'
        }}>
          <QuickStatsCard
            title="Active Plans"
            value="12"
            subtitle="+2 this week"
            icon="📋"
            color="#4ade80"
          />
          <QuickStatsCard
            title="Completed Tasks"
            value="34"
            subtitle="+5 this week"
            icon="✅"
            color="#06b6d4"
          />
          <QuickStatsCard
            title="Upcoming Deadlines"
            value="3"
            subtitle="Next 7 days"
            icon="⏰"
            color="#f59e0b"
          />
          <QuickStatsCard
            title="AI Insights"
            value="87%"
            subtitle="Productivity score"
            icon="🤖"
            color="#8b5cf6"
          />
        </div>

        {/* Professional Dashboard Layout */}
        <div className="dashboard-main" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Summary Cards Row */}
          <div className="summary-cards-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <SummaryCard title="Finance" value="$12,500" description="Current Balance" link="/finance" icon="💰" color="#06b6d4" />
            <SummaryCard title="Travel" value="Paris Trip" description="Next Trip" link="/travel" icon="✈️" color="#f59e0b" />
            <SummaryCard title="Day Planner" value="3 Tasks" description="Today" link="/day" icon="🗓️" color="#4ade80" />
            <SummaryCard title="Health" value="7,200" description="Steps Today" link="/health" icon="🏃‍♂️" color="#8b5cf6" />
          </div>

          {/* Activity Feed and Quick Add */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="activity-feed-card glassmorphism" style={{ flex: 2, minWidth: '320px', padding: '1.5rem', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
              <Heading level="h4" size="md" className="ai-heading" style={{ marginBottom: '1rem' }}>Recent Activity</Heading>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontSize: '1.2rem' }}>➕</span>Added new expense in <b>Finance</b></li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontSize: '1.2rem' }}>✈️</span>Booked flight to <b>Paris</b> in <b>Travel</b></li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontSize: '1.2rem' }}>✅</span>Completed "Team Meeting" in <b>Day Planner</b></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontSize: '1.2rem' }}>🏃‍♂️</span>Logged <b>7,200 steps</b> in <b>Health</b></li>
              </ul>
            </div>
            <div style={{ flex: 1, minWidth: '120px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <button className="fab-add" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '2rem', boxShadow: '0 4px 24px rgba(102,126,234,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Add New Item">+</button>
            </div>
          </div>

          {/* Main Dashboard Grid: Recent Plans & AI Insights */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
            {/* Left: Recent Plans */}
            <AICard title="Recent Plans">
              <div>
                {mockPlans.map((plan, index) => (
                  <PlanItem key={index} {...plan} />
                ))}
              </div>
              <Button 
                variant="outline" 
                style={{ 
                  marginTop: '1rem',
                  background: 'rgba(102,126,234,0.1)',
                  borderColor: '#667eea',
                  color: '#667eea'
                }}
              >
                View all plans →
              </Button>
            </AICard>
            {/* Right: AI Insights */}
            <AICard title="AI Insights">
              <div style={{ marginBottom: '1rem' }}>
                <Text size="sm" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>
                  🎯 You're 23% more productive this week!
                </Text>
                <Text size="sm" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>
                  🚀 Consider working on "Japan Vacation" next
                </Text>
                <Text size="sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  💡 Your best productivity hours: 9-11 AM
                </Text>
              </div>
              <Button variant="outline" style={{ 
                background: 'rgba(240,171,252,0.1)', 
                borderColor: '#f0abfc',
                color: '#f0abfc'
              }}>
                More insights →
              </Button>
            </AICard>
          </div>
        </div>

        {/* AI Disclaimer in Footer Banner */}
        <footer style={{ marginTop: '2.5rem', padding: '1.25rem 0', background: 'var(--sp-card)', borderRadius: '14px', textAlign: 'center', color: 'var(--sp-text)', fontSize: '0.95rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <span style={{ fontWeight: 600 }}>AI Disclaimer:</span> This dashboard uses AI to assist with planning and suggestions. All AI features follow ethical guidelines: transparency, privacy, fairness, and user control. Data is processed securely and never shared without consent. For more, see our <a href="/ai-ethics" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>AI Ethics Policy</a>.
        </footer>

        {/* Main Dashboard Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Left Column: Recent Plans */}
          <div>
            <AICard title="Recent Plans">
              <div>
                {mockPlans.map((plan, index) => (
                  <PlanItem key={index} {...plan} />
                ))}
              </div>
              <Button 
                variant="outline" 
                style={{ 
                  marginTop: '1rem',
                  background: 'rgba(102,126,234,0.1)',
                  borderColor: '#667eea',
                  color: '#667eea'
                }}
              >
                View all plans →
              </Button>
            </AICard>
          </div>
          {/* Right Column: Calendar and AI Insights */}
          <div>
          {/* <AICard title="Calendar">
            <CompactCalendar />
          </AICard> */}
            <AICard title="AI Insights">
              <div style={{ marginBottom: '1rem' }}>
                <Text size="sm" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>
                  🎯 You're 23% more productive this week!
                </Text>
                <Text size="sm" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>
                  🚀 Consider working on "Japan Vacation" next
                </Text>
                <Text size="sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  💡 Your best productivity hours: 9-11 AM
                </Text>
              </div>
              <Button variant="outline" style={{ 
                background: 'rgba(240,171,252,0.1)', 
                borderColor: '#f0abfc',
                color: '#f0abfc'
              }}>
                More insights →
              </Button>
            </AICard>
          </div>
        </div>

        {/* Development Controls */}
        <AICard title="🔧 Development Controls" className="border-2 border-dashed" style={{
          border: '2px dashed #667eea',
          background: 'rgba(102,126,234,0.05)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <Button
              onClick={logout}
              variant="outline"
              style={{
                background: 'rgba(239,68,68,0.1)',
                borderColor: '#ef4444',
                color: '#ef4444'
              }}
            >
              🚪 Mock Logout
            </Button>
            <Button
              onClick={() => alert('This would enable real OAuth authentication')}
              variant="outline"
              style={{
                background: 'rgba(34,197,94,0.1)',
                borderColor: '#22c55e',
                color: '#22c55e'
              }}
            >
              🔐 Enable Real Auth
            </Button>
            <Button
              onClick={() => setCurrentPage(currentPage === 'dashboard' ? 'plans' : 'dashboard')}
              variant="outline"
              style={{
                background: 'rgba(59,130,246,0.1)',
                borderColor: '#3b82f6',
                color: '#3b82f6'
              }}
            >
              🔄 Switch View
            </Button>
            <div style={{ marginLeft: 'auto' }}>
              <Text size="sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Current: <strong>{currentPage}</strong> | Provider: <strong>{state.user?.provider}</strong>
              </Text>
            </div>
          </div>
        </AICard>
      </main>

      {/* AI Neural Network Background Effects */}
      <div className="neural-overlay">
        <svg className="neural-network-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <g className="neural-connections">
            <line x1="100" y1="100" x2="300" y2="200" stroke="rgba(102, 126, 234, 0.3)" strokeWidth="2" filter="url(#glow)" />
            <line x1="300" y1="200" x2="500" y2="150" stroke="rgba(118, 75, 162, 0.3)" strokeWidth="2" filter="url(#glow)" />
            <line x1="500" y1="150" x2="700" y2="300" stroke="rgba(67, 233, 123, 0.3)" strokeWidth="2" filter="url(#glow)" />
            <line x1="200" y1="400" x2="400" y2="350" stroke="rgba(56, 249, 215, 0.3)" strokeWidth="2" filter="url(#glow)" />
          </g>
          
          <g className="neural-nodes">
            <circle cx="100" cy="100" r="4" fill="#667eea" filter="url(#glow)" className="neural-pulse" />
            <circle cx="300" cy="200" r="6" fill="#764ba2" filter="url(#glow)" className="neural-pulse" />
            <circle cx="500" cy="150" r="5" fill="#43e97b" filter="url(#glow)" className="neural-pulse" />
            <circle cx="700" cy="300" r="4" fill="#38f9d7" filter="url(#glow)" className="neural-pulse" />
          </g>
        </svg>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '2rem 0',
        marginTop: '3rem',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Company Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem'
                }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>S</Text>
                </div>
                <Heading level="h4" size="lg" className="ai-heading">SmartPlanner</Heading>
              </div>
              <Text style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                AI-powered planning platform that helps you organize, track, and achieve your goals with intelligent insights and automation.
              </Text>
            </div>

            {/* Quick Links */}
            <div>
              <Heading level="h5" size="md" className="ai-heading" style={{ marginBottom: '1rem' }}>
                Quick Links
              </Heading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Dashboard', 'Plans', 'Analytics', 'Calendar', 'Settings'].map((link) => (
                  <Text key={link} style={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}>
                    {link}
                  </Text>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <Heading level="h5" size="md" className="ai-heading" style={{ marginBottom: '1rem' }}>
                Features
              </Heading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['AI Assistant', 'Smart Planning', 'Progress Tracking', 'Team Collaboration', 'Integrations'].map((feature) => (
                  <Text key={feature} style={{ 
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}>
                    {feature}
                  </Text>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <Heading level="h5" size="md" className="ai-heading" style={{ marginBottom: '1rem' }}>
                Get Help
              </Heading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>📧 support@smartplanner.ai</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>💬 Chat with Aarya AI</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>📚 Help Center</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>🎥 Video Tutorials</Text>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
              © 2025 SmartPlanner. All rights reserved. Made with 🤖 AI assistance.
            </Text>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer' }}>
                Privacy Policy
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer' }}>
                Terms of Service
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer' }}>
                Cookie Policy
              </Text>
            </div>
          </div>
        </div>
      </footer>
      <AaryaAIAssistant />
    </div>
    </ThemeContext.Provider>
  );
};

const SmartPlannerAppDev: React.FC = () => {
  return (
    <ThemeProvider initialAppTheme="default" initialColorMode="dark">
      <MockAuthProvider>
        <DevDashboard />
      </MockAuthProvider>
    </ThemeProvider>
  );
};

export default SmartPlannerAppDev;

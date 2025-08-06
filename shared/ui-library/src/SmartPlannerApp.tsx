import React from 'react';
import { AuthProvider, useAuth } from './features/auth/OAuthContext';
import { Dashboard } from './features/dashboard/Dashboard';
import { OAuthLogin } from './features/auth/OAuthLogin';
import { ThemeProvider } from './themes/ThemeProvider';
import './App.css';
import './styles/ai-modern.css';
import './styles/light-theme-fixes.css';

const AppContent: React.FC = () => {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <div className="neural-network-bg particle-field" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div className="glassmorphism ai-card" style={{
          padding: '2rem',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
          <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>Loading SmartPlanner...</h2>
          <p style={{ margin: 0, opacity: 0.7 }}>Initializing your AI-powered workspace</p>
        </div>
      </div>
    );
  }

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="neural-network-bg particle-field" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div className="glassmorphism ai-card" style={{
          padding: '2rem',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              margin: 0,
              marginBottom: '0.5rem',
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🚀 SmartPlanner AI
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
              fontSize: '1.1rem'
            }}>
              Your AI-powered planning companion
            </p>
          </div>

          <OAuthLogin
            onLoginSuccess={() => console.log('Login successful!')}
            onLoginError={(error) => console.error('Login error:', error)}
          />

          {state.error && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                ⚠️ {state.error}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <Dashboard />;
};

const SmartPlannerApp: React.FC = () => {
  return (
    <ThemeProvider initialAppTheme="default" initialColorMode="dark">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default SmartPlannerApp;

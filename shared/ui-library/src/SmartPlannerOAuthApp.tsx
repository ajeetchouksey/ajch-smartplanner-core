import React from 'react';
import { AuthProvider } from './features/auth/OAuthContext';
import { OAuthLogin } from './features/auth/OAuthLogin';
import { ThemeProvider } from './themes/ThemeProvider';
import './App.css';
import './styles/ai-modern.css';
import './styles/light-theme-fixes.css';

const SmartPlannerOAuthApp: React.FC = () => {
  const handleLoginSuccess = () => {
    console.log('Login successful!');
    alert('Login successful! Welcome to SmartPlanner.');
  };

  const handleLoginError = (error: string) => {
    console.error('Login error:', error);
    alert(`Login failed: ${error}`);
  };

  return (
    <ThemeProvider initialAppTheme="default" initialColorMode="light">
      <AuthProvider>
        <div className="neural-network-bg particle-field" style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '2rem'
        }}>
          {/* Floating AI Particles */}
          <div className="ai-particles">
            <div className="particle particle-1 neural-glow"></div>
            <div className="particle particle-2 cyber-glow"></div>
            <div className="particle particle-3 matrix-glow"></div>
            <div className="particle particle-4 neural-glow"></div>
            <div className="particle particle-5 cyber-glow"></div>
          </div>

          {/* Main Login Interface */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <OAuthLogin 
              onLoginSuccess={handleLoginSuccess}
              onLoginError={handleLoginError}
            />
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default SmartPlannerOAuthApp;

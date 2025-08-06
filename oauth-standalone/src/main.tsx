import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './OAuthContext';
import { OAuthLogin } from './OAuthLogin';

// CSS styles
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  body::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
    animation: pulse 4s ease-in-out infinite alternate;
  }

  #root {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  /* Floating particles */
  .floating-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
  }

  .particle {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
  }

  .particle:nth-child(1) {
    width: 80px;
    height: 80px;
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  .particle:nth-child(2) {
    width: 120px;
    height: 120px;
    top: 70%;
    right: 10%;
    animation-delay: 2s;
  }

  .particle:nth-child(3) {
    width: 60px;
    height: 60px;
    top: 50%;
    left: 80%;
    animation-delay: 4s;
  }

  .particle:nth-child(4) {
    width: 100px;
    height: 100px;
    top: 20%;
    right: 30%;
    animation-delay: 1s;
  }

  .particle:nth-child(5) {
    width: 40px;
    height: 40px;
    bottom: 20%;
    left: 20%;
    animation-delay: 3s;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

// Main App Component
const App: React.FC = () => {
  const handleLoginSuccess = () => {
    console.log('Login successful!');
  };

  const handleLoginError = (error: string) => {
    console.error('Login error:', error);
  };

  return (
    <AuthProvider>
      {/* Floating Particles Background */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        <OAuthLogin 
          onLoginSuccess={handleLoginSuccess}
          onLoginError={handleLoginError}
        />
      </div>
    </AuthProvider>
  );
};

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Root container not found');
}

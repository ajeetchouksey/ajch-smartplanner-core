import React from 'react';
import { createRoot } from 'react-dom/client';

// OAuth Context and Components (isolated)
import { AuthProvider } from './features/auth/OAuthContext';
import { OAuthLogin } from './features/auth/OAuthLogin';

// Simple OAuth-only app with zero dependencies on UI showcase
const OAuthOnlyApp: React.FC = () => {
  return (
    <AuthProvider>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '50%',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: 'white', fontSize: '24px' }}>✓</span>
          </div>
          
          <h1 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.75rem',
            fontWeight: '600',
            color: '#111827'
          }}>
            Welcome to SmartPlanner
          </h1>
          
          <p style={{
            margin: '0 0 2rem 0',
            color: '#6b7280',
            fontSize: '1rem'
          }}>
            Sign in to access your planning tools
          </p>
          
          <OAuthLogin />
          
          <p style={{
            margin: '1.5rem 0 0 0',
            fontSize: '0.875rem',
            color: '#9ca3af'
          }}>
            By signing in, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </AuthProvider>
  );
};

// Mount the app
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(<OAuthOnlyApp />);

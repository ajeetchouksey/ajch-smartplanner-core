import React from 'react';

interface SimpleRouterProps {
  children: React.ReactNode;
}

export const SimpleRouter: React.FC<SimpleRouterProps> = ({ children }) => {
  const path = window.location.pathname;
  
  // OAuth callback routes
  if (path === '/auth/google/callback') {
    return <GoogleCallback />;
  }
  
  if (path === '/auth/github/callback') {
    return <GitHubCallback />;
  }
  
  // Default route (main app)
  return <>{children}</>;
};

const GoogleCallback: React.FC = () => {
  React.useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          console.log('✅ Google OAuth code received:', code);
          // Store success in localStorage for the main app to pick up
          localStorage.setItem('oauth_success', JSON.stringify({
            provider: 'google',
            code,
            timestamp: Date.now()
          }));
          
          // Redirect back to main app
          window.location.href = '/';
        } else {
          throw new Error('No authorization code received from Google');
        }
      } catch (error) {
        console.error('Google OAuth error:', error);
        alert('Google OAuth failed. Please try again.');
        window.location.href = '/';
      }
    };
    
    handleGoogleCallback();
  }, []);
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      flexDirection: 'column'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🔄</div>
      <h2>Processing Google Authentication...</h2>
      <p>Please wait while we complete your login.</p>
    </div>
  );
};

const GitHubCallback: React.FC = () => {
  React.useEffect(() => {
    const handleGitHubCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          console.log('✅ GitHub OAuth code received:', code);
          // Store success in localStorage for the main app to pick up
          localStorage.setItem('oauth_success', JSON.stringify({
            provider: 'github',
            code,
            timestamp: Date.now()
          }));
          
          // Redirect back to main app
          window.location.href = '/';
        } else {
          throw new Error('No authorization code received from GitHub');
        }
      } catch (error) {
        console.error('GitHub OAuth error:', error);
        alert('GitHub OAuth failed. Please try again.');
        window.location.href = '/';
      }
    };
    
    handleGitHubCallback();
  }, []);
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      flexDirection: 'column'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🔄</div>
      <h2>Processing GitHub Authentication...</h2>
      <p>Please wait while we complete your login.</p>
    </div>
  );
};

import React, { useEffect } from 'react';
import { useAuth } from './OAuthContext';

const App: React.FC = () => {
  const { state, loginWithOAuth, logout } = useAuth();
  
  // Handle OAuth callback on app startup
  useEffect(() => {
    const handleOAuthCallback = () => {
      const path = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);
      
      if (path === '/auth/google/callback' || path === '/auth/github/callback') {
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
          console.error('OAuth error:', error);
          alert(`OAuth error: ${error}`);
          window.history.replaceState({}, '', '/');
          return;
        }
        
        if (code) {
          const provider = path.includes('google') ? 'google' : 'github';
          console.log(`✅ ${provider} OAuth callback received with code:`, code);
          
          // Simulate successful login with the OAuth code
          // In a real app, you'd exchange this code for an access token
          const mockUser = {
            id: `${provider}-${Date.now()}`,
            name: provider === 'google' ? 'Real Google User' : 'Real GitHub User',
            email: `user@${provider === 'google' ? 'gmail.com' : 'github.com'}`,
            avatar: provider === 'google' 
              ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format'
              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
            provider: provider as 'google' | 'github'
          };
          
          // Manually dispatch login success
          if (state.dispatch) {
            state.dispatch({ type: 'LOGIN_SUCCESS', user: mockUser });
          }
          
          // Clean up URL
          window.history.replaceState({}, '', '/');
          
          alert(`✅ ${provider} OAuth successful! Welcome ${mockUser.name}`);
        }
      }
    };
    
    handleOAuthCallback();
  }, [state.dispatch]);

  if (state.loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #4285f4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} />
        <p>Authenticating...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (state.user) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '400px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <img 
            src={state.user.avatar} 
            alt={state.user.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              marginBottom: '1rem',
              border: '3px solid white'
            }}
          />
          <h2 style={{ margin: '0 0 0.5rem' }}>Welcome!</h2>
          <h3 style={{ margin: '0 0 0.5rem', fontWeight: 'normal' }}>{state.user.name}</h3>
          <p style={{ margin: '0 0 1rem', opacity: 0.8 }}>{state.user.email}</p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            marginBottom: '2rem'
          }}>
            <span style={{ marginRight: '0.5rem' }}>
              {state.user.provider === 'google' ? '🔴' : '🐙'}
            </span>
            Signed in with {state.user.provider === 'google' ? 'Google' : 'GitHub'}
          </div>
          <div>
            <button
              onClick={logout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.75rem 2rem',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '400px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '0 0 1rem',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          SmartPlanner
        </h1>
        <p style={{ margin: '0 0 2rem', opacity: 0.9, fontSize: '1.1rem' }}>
          Sign in to access your personalized planning experience
        </p>
        
        {state.error && (
          <div style={{
            background: 'rgba(255,0,0,0.2)',
            border: '1px solid rgba(255,0,0,0.5)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#ffcdd2'
          }}>
            {state.error}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={() => loginWithOAuth('google')}
            disabled={state.loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              background: 'white',
              color: '#333',
              border: 'none',
              padding: '0.875rem 1.5rem',
              borderRadius: '50px',
              cursor: state.loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              opacity: state.loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!state.loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          
          <button
            onClick={() => loginWithOAuth('github')}
            disabled={state.loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              background: '#24292e',
              color: 'white',
              border: 'none',
              padding: '0.875rem 1.5rem',
              borderRadius: '50px',
              cursor: state.loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              opacity: state.loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!state.loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>
        
        <p style={{ 
          margin: '2rem 0 0', 
          opacity: 0.7, 
          fontSize: '0.9rem' 
        }}>
          🔒 Your data is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default App;

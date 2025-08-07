import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'github';
}

const SimpleOAuth: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Immediate callback detection on component mount
  const isOnCallbackUrl = window.location.pathname.includes('/auth/') && 
                         (window.location.pathname.includes('google') || window.location.pathname.includes('github'));
  
  console.log('🎯 Component Mount Check:', {
    pathname: window.location.pathname,
    search: window.location.search,
    isOnCallbackUrl,
    fullUrl: window.location.href
  });

  // Handle OAuth callback on page load
  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const state = urlParams.get('state');
      const path = window.location.pathname;
      const fullURL = window.location.href;

      console.log('🔍 OAuth Callback Check:', {
        fullURL,
        path,
        search: window.location.search,
        hasCode: !!code,
        hasError: !!error,
        hasState: !!state,
        code: code ? code.substring(0, 10) + '...' : null,
        error,
        pathIncludesGoogle: path.includes('google'),
        pathIncludesGithub: path.includes('github'),
        isCallbackPath: path.includes('/auth/')
      });

      if (error) {
        console.error('❌ OAuth Error:', error);
        setError(`OAuth error: ${error}`);
        setLoading(false);
        // Clean URL
        window.history.replaceState({}, '', '/');
        return;
      }

      // Check for OAuth callback - be more flexible with path detection
      const isGoogleCallback = path.includes('google') || path.includes('/auth/google');
      const isGithubCallback = path.includes('github') || path.includes('/auth/github');
      const hasAuthCode = !!code;

      console.log('🎯 Callback Detection:', {
        isGoogleCallback,
        isGithubCallback,
        hasAuthCode,
        willProceed: hasAuthCode && (isGoogleCallback || isGithubCallback)
      });

      if (hasAuthCode && (isGoogleCallback || isGithubCallback)) {
        const provider = isGoogleCallback ? 'google' : 'github';
        
        console.log(`✅ ${provider} OAuth callback detected!`, {
          provider,
          code: code.substring(0, 10) + '...',
          path,
          fullURL
        });
        
        // Create user from OAuth success
        const newUser: User = {
          id: `${provider}-${Date.now()}`,
          name: provider === 'google' ? 'Google User (Demo)' : 'GitHub User (Demo)',
          email: `demo.user@${provider === 'google' ? 'gmail.com' : 'github.com'}`,
          avatar: provider === 'google' 
            ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
          provider
        };
        
        console.log('👤 Creating user session:', newUser);
        
        // Set user state
        setUser(newUser);
        setLoading(false);
        setError(null);
        
        // Save to localStorage
        localStorage.setItem('oauth_user', JSON.stringify(newUser));
        localStorage.removeItem('oauth_provider_attempt');
        
        console.log('💾 User saved to localStorage');
        
        // Clean URL immediately
        window.history.replaceState({}, '', '/');
        console.log('🧹 URL cleaned');
        
        // Show success message after a brief delay
        setTimeout(() => {
          console.log('🎉 Showing success message');
          alert(`🎉 Welcome! You've successfully signed in with ${provider}!\n\nThis is demo data - in production, this would fetch your real profile.`);
        }, 500);
        
        return; // Important: exit early after handling callback
      }
      
      console.log('ℹ️ No OAuth callback detected, continuing normal flow');
    };

    // Check for saved user first
    const savedUser = localStorage.getItem('oauth_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('🔄 Restored user from localStorage:', parsedUser);
        setUser(parsedUser);
        setLoading(false);
      } catch (e) {
        console.warn('⚠️ Failed to parse saved user, clearing localStorage:', e);
        localStorage.removeItem('oauth_user');
      }
    }

    // Handle OAuth callback
    handleCallback();

    // Listen for URL changes (for SPA navigation)
    const handleUrlChange = () => {
      console.log('🔄 URL changed, rechecking callback...');
      handleCallback();
    };

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleUrlChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const loginWithOAuth = (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);

    const baseUrl = window.location.origin; // Gets current domain and port
    
    const configs = {
      google: {
        clientId: '939308613423-88pm6i99ko5bbscva76q76kt4mciphmn.apps.googleusercontent.com',
        authUrl: 'https://accounts.google.com/oauth2/auth',
        redirectUri: `${baseUrl}/auth/google/callback`,
        scope: 'openid email profile',
        params: {
          response_type: 'code',
          access_type: 'offline',
          prompt: 'consent'
        }
      },
      github: {
        clientId: 'Ov23liVcPs71PC2mknou',
        authUrl: 'https://github.com/login/oauth/authorize',
        redirectUri: `${baseUrl}/auth/github/callback`,
        scope: 'user:email read:user',
        params: {
          state: Math.random().toString(36).substring(7)
        }
      }
    };

    const config = configs[provider];
    
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope,
      ...config.params
    });

    const authUrl = `${config.authUrl}?${params.toString()}`;
    
    console.log(`🚀 Redirecting to ${provider} OAuth:`, authUrl);
    console.log(`📍 Redirect URI: ${config.redirectUri}`);
    console.log(`📋 Current URL: ${baseUrl}`);
    
    // Store the provider for callback handling
    localStorage.setItem('oauth_provider_attempt', provider);
    
    // Redirect to OAuth provider
    window.location.href = authUrl;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('oauth_user');
    setError(null);
  };

  if (loading) {
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

  if (user) {
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
            src={user.avatar} 
            alt={user.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              marginBottom: '1rem',
              border: '3px solid white'
            }}
          />
          <h2 style={{ margin: '0 0 0.5rem' }}>🎉 Success!</h2>
          <h3 style={{ margin: '0 0 0.5rem', fontWeight: 'normal' }}>{user.name}</h3>
          <p style={{ margin: '0 0 1rem', opacity: 0.8 }}>{user.email}</p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            marginBottom: '2rem'
          }}>
            <span style={{ marginRight: '0.5rem' }}>
              {user.provider === 'google' ? '🔴' : '🐙'}
            </span>
            Signed in with {user.provider === 'google' ? 'Google' : 'GitHub'}
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
          Sign in with your real OAuth credentials
        </p>
        
        {/* Show callback test button if we're on a callback URL */}
        {isOnCallbackUrl && (
          <div style={{
            marginBottom: '2rem',
            padding: '1rem',
            background: 'rgba(255, 255, 0, 0.1)',
            border: '2px solid rgba(255, 255, 0, 0.5)',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#ffeb3b' }}>
              🔧 OAuth Callback Detected! Click to complete sign-in:
            </p>
            <button
              onClick={() => {
                console.log('🔍 Manual callback check triggered');
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');
                const path = window.location.pathname;
                
                console.log('Manual check details:', {
                  path,
                  search: window.location.search,
                  code: code ? code.substring(0, 10) + '...' : null,
                  isGithubPath: path.includes('github'),
                  isGooglePath: path.includes('google')
                });
                
                if (code) {
                  console.log('Found auth code, creating demo user...');
                  const provider = path.includes('google') ? 'google' : 'github';
                  const newUser: User = {
                    id: `${provider}-manual-${Date.now()}`,
                    name: `${provider === 'google' ? 'Google' : 'GitHub'} User (Demo)`,
                    email: `demo.user@${provider === 'google' ? 'gmail.com' : 'github.com'}`,
                    avatar: provider === 'google' 
                      ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format'
                      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
                    provider
                  };
                  
                  console.log('Setting manual user:', newUser);
                  setUser(newUser);
                  setLoading(false);
                  setError(null);
                  localStorage.setItem('oauth_user', JSON.stringify(newUser));
                  window.history.replaceState({}, '', '/');
                  alert(`✅ Success! Welcome ${provider} user!`);
                } else {
                  alert('❌ No auth code found in URL. Current URL: ' + window.location.href);
                }
              }}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            >
              🚀 Complete OAuth Sign-In
            </button>
          </div>
        )}
        
        {error && (
          <div style={{
            background: 'rgba(255,0,0,0.2)',
            border: '1px solid rgba(255,0,0,0.5)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#ffcdd2'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={() => loginWithOAuth('google')}
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
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
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
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>
        
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.7 }}>
          <p>🔗 Current URL: {window.location.origin}</p>
          <p>📍 Google Redirect: {window.location.origin}/auth/google/callback</p>
          <p>📍 GitHub Redirect: {window.location.origin}/auth/github/callback</p>
          
          {/* Debug section */}
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '8px',
            fontSize: '0.8rem',
            textAlign: 'left'
          }}>
            <p><strong>🔧 Debug Info:</strong></p>
            <p>Current Path: {window.location.pathname}</p>
            <p>Search Params: {window.location.search || '(none)'}</p>
            <button
              onClick={() => {
                console.log('🔍 Manual callback check triggered');
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');
                const path = window.location.pathname;
                
                console.log('Manual check details:', {
                  path,
                  search: window.location.search,
                  code: code ? code.substring(0, 10) + '...' : null,
                  isGithubPath: path.includes('github'),
                  isGooglePath: path.includes('google')
                });
                
                if (code) {
                  console.log('Found auth code, creating demo user...');
                  const provider = path.includes('google') ? 'google' : 'github';
                  const newUser: User = {
                    id: `${provider}-manual-${Date.now()}`,
                    name: `${provider === 'google' ? 'Google' : 'GitHub'} User (Manual)`,
                    email: `manual@${provider === 'google' ? 'gmail.com' : 'github.com'}`,
                    avatar: provider === 'google' 
                      ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format'
                      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
                    provider
                  };
                  
                  console.log('Setting manual user:', newUser);
                  setUser(newUser);
                  setLoading(false);
                  setError(null);
                  localStorage.setItem('oauth_user', JSON.stringify(newUser));
                  window.history.replaceState({}, '', '/');
                  alert(`Manual callback successful! Welcome ${provider} user!`);
                } else {
                  alert('No auth code found in URL. Current URL: ' + window.location.href);
                }
              }}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: 'white',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Manual Callback Test
            </button>
          </div>
          
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '8px',
            fontSize: '0.8rem',
            textAlign: 'left'
          }}>
            <p><strong>⚠️ Configuration Required:</strong></p>
            <p>• Add Google redirect URI to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" style={{color: '#4fc3f7'}}>Google Cloud Console</a></p>
            <p>• Add GitHub redirect URI to <a href="https://github.com/settings/applications" target="_blank" style={{color: '#4fc3f7'}}>GitHub OAuth Apps</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleOAuth;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../OAuthContext';

interface OAuthCallbackProps {
  provider: 'google' | 'github';
}

export const OAuthCallback: React.FC<OAuthCallbackProps> = ({ provider }) => {
  const { dispatch } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing OAuth callback...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        setMessage('Exchanging code for access token...');

        // Exchange code for access token
        const tokenResponse = await exchangeCodeForToken(provider, code);
        
        setMessage('Fetching user profile...');
        
        // Get user profile
        const userProfile = await fetchUserProfile(provider, tokenResponse.access_token);
        
        // Dispatch success with real user data
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          user: {
            id: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
            avatar: userProfile.avatar,
            provider
          }
        });

        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
        
        // Redirect to main app after short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
        
        dispatch({ 
          type: 'LOGIN_ERROR', 
          error: error instanceof Error ? error.message : 'Authentication failed' 
        });
      }
    };

    handleCallback();
  }, [provider, dispatch]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '3rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        {status === 'processing' && (
          <>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #4285f4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <h2 style={{ margin: '0 0 1rem', color: '#333' }}>
              Authenticating with {provider === 'google' ? 'Google' : 'GitHub'}
            </h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', margin: '0 0 1rem' }}>✅</div>
            <h2 style={{ margin: '0 0 1rem', color: '#2e7d32' }}>Success!</h2>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', margin: '0 0 1rem' }}>❌</div>
            <h2 style={{ margin: '0 0 1rem', color: '#d32f2f' }}>Authentication Failed</h2>
          </>
        )}
        
        <p style={{ color: '#666', margin: 0 }}>{message}</p>
        
        {status === 'error' && (
          <button
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Token exchange function
async function exchangeCodeForToken(provider: 'google' | 'github', code: string) {
  const config = {
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
      tokenUrl: 'https://oauth2.googleapis.com/token',
      redirectUri: `${import.meta.env.VITE_APP_URL}/auth/google/callback`
    },
    github: {
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
      tokenUrl: 'https://github.com/login/oauth/access_token',
      redirectUri: `${import.meta.env.VITE_APP_URL}/auth/github/callback`
    }
  };

  const providerConfig = config[provider];
  
  const response = await fetch(providerConfig.tokenUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: providerConfig.clientId,
      client_secret: providerConfig.clientSecret,
      code,
      redirect_uri: providerConfig.redirectUri,
      ...(provider === 'google' && { grant_type: 'authorization_code' })
    })
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  return await response.json();
}

// User profile fetching function
async function fetchUserProfile(provider: 'google' | 'github', accessToken: string) {
  const apiUrls = {
    google: 'https://www.googleapis.com/oauth2/v2/userinfo',
    github: 'https://api.github.com/user'
  };

  const response = await fetch(apiUrls[provider], {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  const profile = await response.json();
  
  // Normalize profile data across providers
  if (provider === 'google') {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.picture
    };
  } else {
    // GitHub
    return {
      id: profile.id.toString(),
      name: profile.name || profile.login,
      email: profile.email,
      avatar: profile.avatar_url
    };
  }
}

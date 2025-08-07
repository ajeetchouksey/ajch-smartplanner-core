import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Auth State Types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'github';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Auth Actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; user: User }
  | { type: 'LOGIN_ERROR'; error: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.user,
        isAuthenticated: true,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.error,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Initial State
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Context Types
interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  loginWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Mock OAuth URLs - In real implementation, these would be actual OAuth endpoints
const OAUTH_URLS = {
  google: 'https://accounts.google.com/oauth2/auth',
  github: 'https://github.com/login/oauth/authorize',
};

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loginWithOAuth = async (provider: 'google' | 'github') => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Environment variables for OAuth configuration
      const config = {
        google: {
          clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
        },
        github: {
          clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
          clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
        }
      };

      const providerConfig = config[provider];
      const hasRealCredentials = providerConfig.clientId && !providerConfig.clientId.includes('your_');
      
      console.log(`🔐 OAuth Config for ${provider}:`, { 
        clientId: providerConfig.clientId ? '✅ Set' : '❌ Missing',
        hasRealCredentials,
        willUseRealOAuth: hasRealCredentials
      });
      
      if (hasRealCredentials) {
        // REAL OAUTH FLOW
        console.log(`🚀 Starting REAL OAuth flow with ${provider}`);
        
        const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:3012';
        
        // OAuth URLs and parameters
        const oauthParams = provider === 'google' ? {
          authUrl: 'https://accounts.google.com/oauth2/auth',
          params: new URLSearchParams({
            client_id: providerConfig.clientId,
            redirect_uri: `${baseUrl}/auth/google/callback`,
            scope: 'openid email profile',
            response_type: 'code',
            access_type: 'offline',
            prompt: 'consent'
          })
        } : {
          authUrl: 'https://github.com/login/oauth/authorize',
          params: new URLSearchParams({
            client_id: providerConfig.clientId,
            redirect_uri: `${baseUrl}/auth/github/callback`,
            scope: 'user:email read:user',
            state: Math.random().toString(36).substring(7)
          })
        };

        const authUrl = `${oauthParams.authUrl}?${oauthParams.params.toString()}`;
        
        console.log(`🔗 Redirecting to ${provider} OAuth:`, authUrl);
        
        // Redirect to OAuth provider
        window.location.href = authUrl;
        
        // Note: The actual token exchange will happen in the callback
        // For now, we'll simulate success after redirect
        return;
        
      } else {
        // MOCK OAUTH FLOW (fallback for missing credentials)
        console.log(`🧪 Using mock OAuth flow (no real credentials for ${provider})`);
        
        // Simulate realistic OAuth flow timing
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

        // Simulate potential OAuth errors (5% chance)  
        if (Math.random() < 0.05) {
          throw new Error(`Authentication with ${provider} was cancelled or failed. Please try again.`);
        }

        // Mock user data for testing
        const mockUsers = {
          google: {
            id: `google-${Date.now()}`,
            name: 'Sarah Chen (Mock - Add Real Credentials)',
            email: 'sarah.chen@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format',
            provider: 'google' as const,
          },
          github: {
            id: `github-${Date.now()}`,
            name: 'Alex Rodriguez (Mock - Add Real Credentials)',
            email: 'alex.rodriguez@github.com',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
            provider: 'github' as const,
          },
        };

        const user = mockUsers[provider];
        dispatch({ type: 'LOGIN_SUCCESS', user });
      }      // Store authentication data securely
      const authData = {
        user,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };
      localStorage.setItem('smartplanner_auth', JSON.stringify(authData));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to authenticate with ${provider}. Please try again.`;
      dispatch({ type: 'LOGIN_ERROR', error: errorMessage });
    }
  };

  const logout = () => {
    localStorage.removeItem('smartplanner_auth');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check for existing session on mount
  React.useEffect(() => {
    const savedAuth = localStorage.getItem('smartplanner_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        // Check if authentication hasn't expired
        if (authData.expiresAt && Date.now() < authData.expiresAt) {
          dispatch({ type: 'LOGIN_SUCCESS', user: authData.user });
        } else {
          // Authentication expired, clear it
          localStorage.removeItem('smartplanner_auth');
        }
      } catch (error) {
        console.error('Failed to parse saved auth:', error);
        localStorage.removeItem('smartplanner_auth');
      }
    }
  }, []);

  const value: AuthContextType = {
    state,
    dispatch,
    loginWithOAuth,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

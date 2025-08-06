import React, { createContext, useContext, useReducer, useEffect } from 'react';

export type OAuthProvider = 'microsoft' | 'google' | 'facebook';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: OAuthProvider;
  preferences: {
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
      desktop: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private';
      dataSharing: boolean;
    };
  };
  createdAt: Date;
  lastLoginAt: Date;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  state: AuthState;
  loginWithOAuth: (provider: OAuthProvider) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
        isLoading: false,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

// OAuth provider configurations
const oauthConfig = {
  microsoft: {
    clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID || 'your-microsoft-client-id',
    redirectUri: `${window.location.origin}/auth/callback/microsoft`,
    scope: 'openid profile email',
    responseType: 'code',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  },
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id',
    redirectUri: `${window.location.origin}/auth/callback/google`,
    scope: 'openid profile email',
    responseType: 'code',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  },
  facebook: {
    clientId: process.env.REACT_APP_FACEBOOK_CLIENT_ID || 'your-facebook-client-id',
    redirectUri: `${window.location.origin}/auth/callback/facebook`,
    scope: 'email,public_profile',
    responseType: 'code',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
  },
};

// OAuth authentication service
const oauthService = {
  initiateLogin: (provider: OAuthProvider): void => {
    const config = oauthConfig[provider];
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope,
      response_type: config.responseType,
      state: btoa(JSON.stringify({ provider, timestamp: Date.now() })),
    });

    // Add provider-specific parameters
    if (provider === 'microsoft') {
      params.append('response_mode', 'query');
    }

    const authUrl = `${config.authUrl}?${params.toString()}`;
    
    // Store provider in localStorage for callback handling
    localStorage.setItem('oauth_provider', provider);
    
    // Redirect to OAuth provider
    window.location.href = authUrl;
  },

  handleCallback: async (provider: OAuthProvider, code: string, state: string): Promise<User> => {
    // In a real implementation, this would:
    // 1. Exchange the code for tokens with your backend
    // 2. Fetch user information from the provider's API
    // 3. Store the tokens securely
    
    // For demo purposes, we'll simulate different users based on provider
    const mockUsers = {
      microsoft: {
        id: 'ms_' + Date.now(),
        email: 'user@outlook.com',
        name: 'Microsoft User',
        avatar: 'https://via.placeholder.com/40x40/0078d4/ffffff?text=MS',
        provider: 'microsoft' as const,
      },
      google: {
        id: 'goog_' + Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        avatar: 'https://via.placeholder.com/40x40/4285f4/ffffff?text=G',
        provider: 'google' as const,
      },
      facebook: {
        id: 'fb_' + Date.now(),
        email: 'user@facebook.com',
        name: 'Facebook User',
        avatar: 'https://via.placeholder.com/40x40/1877f2/ffffff?text=FB',
        provider: 'facebook' as const,
      },
    };

    const baseUser = mockUsers[provider];
    
    const user: User = {
      ...baseUser,
      preferences: {
        theme: 'default',
        notifications: {
          email: true,
          push: true,
          desktop: false,
        },
        privacy: {
          profileVisibility: 'private',
          dataSharing: false,
        },
      },
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    // Store user data securely (in a real app, this would be more secure)
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    return user;
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update stored user data
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  },

  checkStoredAuth: (): User | null => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
    return null;
  },

  clearStoredAuth: (): void => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('oauth_provider');
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  // Check for stored authentication on mount
  useEffect(() => {
    const storedUser = oauthService.checkStoredAuth();
    if (storedUser) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: storedUser });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const provider = localStorage.getItem('oauth_provider') as OAuthProvider;

    if (code && state && provider) {
      handleOAuthCallback(provider, code, state);
    }
  }, []);

  const handleOAuthCallback = async (provider: OAuthProvider, code: string, state: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const user = await oauthService.handleCallback(provider, code, state);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Authentication failed' });
    }
  };

  const loginWithOAuth = async (provider: OAuthProvider): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      oauthService.initiateLogin(provider);
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Failed to initiate login' });
    }
  };

  const logout = (): void => {
    oauthService.clearStoredAuth();
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!state.user) return;
    
    try {
      await oauthService.updateProfile(state.user.id, updates);
      dispatch({ type: 'UPDATE_PROFILE', payload: updates });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        loginWithOAuth,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

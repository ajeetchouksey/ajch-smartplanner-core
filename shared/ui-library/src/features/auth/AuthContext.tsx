import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthUser, AuthState, LoginCredentials, RegisterData } from '../../shared/types';

// Auth Context
const AuthContext = createContext<{
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
} | null>(null);

// Auth Reducer
type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthUser }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<AuthUser> };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'AUTH_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'AUTH_ERROR':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
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

// Mock Auth Service (replace with real API calls)
const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.email === 'demo@smartplanner.com' && credentials.password === 'demo123') {
      const user: AuthUser = {
        id: '1',
        email: credentials.email,
        name: 'Demo User',
        avatar: undefined,
        emailVerified: true,
        lastLoginAt: new Date(),
      };
      
      // Store token in localStorage
      localStorage.setItem('authToken', 'mock-jwt-token');
      return user;
    }
    
    throw new Error('Invalid email or password');
  },

  async register(data: RegisterData): Promise<AuthUser> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock user creation
    const user: AuthUser = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      avatar: undefined,
      emailVerified: false,
      lastLoginAt: new Date(),
    };
    
    // Store token in localStorage
    localStorage.setItem('authToken', 'mock-jwt-token');
    return user;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    // Mock token validation
    return {
      id: '1',
      email: 'demo@smartplanner.com',
      name: 'Demo User',
      avatar: undefined,
      emailVerified: true,
      lastLoginAt: new Date(),
    };
  },

  logout(): void {
    localStorage.removeItem('authToken');
  },

  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    return { ...currentUser, ...data };
  },
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: 'AUTH_START' });
        const user = await authService.getCurrentUser();
        
        if (user) {
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'AUTH_ERROR', payload: 'Not authenticated' });
        }
      } catch (error) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Authentication check failed' });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const user = await authService.login(credentials);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const user = await authService.register(data);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      dispatch({ type: 'UPDATE_PROFILE', payload: data });
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      state,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

// Login Page Component (we'll create this separately)
const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
        <p className="text-gray-600">Please log in to access SmartPlanner</p>
      </div>
    </div>
  );
};

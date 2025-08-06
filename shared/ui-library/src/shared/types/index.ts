// Core application types for SmartPlanner

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  dashboard: DashboardSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  deadlineReminders: boolean;
  progressUpdates: boolean;
}

export interface DashboardSettings {
  layout: 'grid' | 'list';
  widgets: string[];
  showCompleted: boolean;
  defaultView: 'all' | 'active' | 'upcoming';
}

export interface Plan {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: PlanStatus;
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  tags: string[];
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type PlanStatus = 'draft' | 'active' | 'completed' | 'archived' | 'paused';

export interface Milestone {
  id: string;
  planId: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  progress: number; // 0-100
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
  createdAt: Date;
}

export interface AnalyticsData {
  userId: string;
  period: AnalyticsPeriod;
  dateRange: {
    start: Date;
    end: Date;
  };
  metrics: ProductivityMetrics;
  trends: TrendData[];
  insights: AIInsight[];
}

export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface ProductivityMetrics {
  plansCreated: number;
  plansCompleted: number;
  milestonesCompleted: number;
  averageCompletionTime: number; // in days
  productivityScore: number; // 0-100
  streakDays: number;
  onTimeCompletionRate: number; // percentage
}

export interface TrendData {
  date: Date;
  value: number;
  metric: string;
}

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number; // 0-1
  actionable: boolean;
  actions?: RecommendedAction[];
  createdAt: Date;
}

export type InsightType = 
  | 'productivity_trend' 
  | 'deadline_risk' 
  | 'optimization_opportunity' 
  | 'pattern_recognition'
  | 'goal_achievement';

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  type: 'adjust_deadline' | 'break_down_task' | 'change_priority' | 'add_milestone';
  metadata?: Record<string, any>;
}

// Authentication types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  emailVerified: boolean;
  lastLoginAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// UI Component types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[]; // for select fields
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Dashboard Widget types
export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: { x: number; y: number };
  config: Record<string, any>;
  visible: boolean;
}

export type WidgetType = 
  | 'recent_plans' 
  | 'upcoming_deadlines' 
  | 'productivity_chart'
  | 'milestone_progress'
  | 'ai_insights'
  | 'quick_actions';

export type WidgetSize = 'small' | 'medium' | 'large' | 'xlarge';

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  expiresAt?: Date;
}

export type NotificationType = 
  | 'deadline_reminder'
  | 'milestone_completed'
  | 'plan_shared'
  | 'ai_insight'
  | 'system_update'
  | 'achievement_unlocked';

// Search and Filter types
export interface SearchFilters {
  query?: string;
  categories?: string[];
  priorities?: Priority[];
  statuses?: PlanStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

import React, { useState } from 'react';
import { useAuth } from '../auth/OAuthContext';
import { Header } from '../../components/layout/Header/Header';

export const Dashboard: React.FC = () => {
  const { state, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const mockUser = {
    name: state.user?.name || 'User',
    email: state.user?.email || '',
    avatar: state.user?.avatar,
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    console.log('Navigate to:', page);
    // TODO: Implement routing
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header
          user={mockUser}
          currentPage={currentPage}
          onNavigate={handleNavigation}
          showSearch={true}
          showNotifications={true}
        />      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {state.user?.name}! 👋
          </h1>
          <p className="mt-1 text-gray-600">
            Here's what's happening with your plans today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Plans"
            value="12"
            trend="+2 this week"
            color="blue"
          />
          <StatCard
            title="Completed"
            value="34"
            trend="+5 this week"
            color="green"
          />
          <StatCard
            title="Upcoming Deadlines"
            value="3"
            trend="Next 7 days"
            color="orange"
          />
          <StatCard
            title="Productivity Score"
            value="87%"
            trend="+5% this week"
            color="purple"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Plans */}
          <div className="lg:col-span-2">
            <DashboardCard title="Recent Plans">
              <div className="space-y-3">
                {mockPlans.map((plan) => (
                  <PlanItem key={plan.id} plan={plan} />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  View all plans →
                </button>
              </div>
            </DashboardCard>
          </div>

          {/* Quick Actions & Upcoming */}
          <div className="space-y-6">
            <DashboardCard title="Quick Actions">
              <div className="space-y-3">
                <QuickActionButton icon="plus" text="Create New Plan" />
                <QuickActionButton icon="calendar" text="Schedule Review" />
                <QuickActionButton icon="chart" text="View Analytics" />
                <QuickActionButton icon="settings" text="Settings" />
              </div>
            </DashboardCard>

            <DashboardCard title="Upcoming Deadlines">
              <div className="space-y-3">
                {mockDeadlines.map((deadline) => (
                  <DeadlineItem key={deadline.id} deadline={deadline} />
                ))}
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* Logout Button (temporary) */}
        <div className="mt-8 text-center">
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
};

// Supporting Components
interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <div className="w-6 h-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{trend}</p>
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

interface QuickActionButtonProps {
  icon: string;
  text: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ text }) => (
  <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="w-5 h-5 mr-3 text-gray-400" />
    <span className="text-sm font-medium">{text}</span>
  </button>
);

// Mock Data
const mockPlans = [
  {
    id: '1',
    title: 'Complete Q1 Marketing Campaign',
    status: 'active',
    progress: 75,
    dueDate: new Date('2025-08-15'),
  },
  {
    id: '2',
    title: 'Learn React Advanced Patterns',
    status: 'active',
    progress: 40,
    dueDate: new Date('2025-08-20'),
  },
  {
    id: '3',
    title: 'Plan Family Vacation',
    status: 'draft',
    progress: 20,
    dueDate: new Date('2025-09-01'),
  },
];

const mockDeadlines = [
  {
    id: '1',
    title: 'Project Review Meeting',
    date: new Date('2025-08-08'),
    type: 'milestone',
  },
  {
    id: '2',
    title: 'Submit Budget Proposal',
    date: new Date('2025-08-10'),
    type: 'deadline',
  },
  {
    id: '3',
    title: 'Team Standup',
    date: new Date('2025-08-12'),
    type: 'meeting',
  },
];

interface PlanItemProps {
  plan: typeof mockPlans[0];
}

const PlanItem: React.FC<PlanItemProps> = ({ plan }) => (
  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
    <div className="flex-1">
      <h4 className="text-sm font-medium text-gray-900">{plan.title}</h4>
      <div className="flex items-center mt-1">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${plan.progress}%` }}
          />
        </div>
        <span className="ml-2 text-xs text-gray-500">{plan.progress}%</span>
      </div>
    </div>
    <div className="ml-4 text-xs text-gray-500">
      Due {plan.dueDate.toLocaleDateString()}
    </div>
  </div>
);

interface DeadlineItemProps {
  deadline: typeof mockDeadlines[0];
}

const DeadlineItem: React.FC<DeadlineItemProps> = ({ deadline }) => {
  const daysUntil = Math.ceil((deadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
        <p className="text-xs text-gray-500">{deadline.date.toLocaleDateString()}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${
        daysUntil <= 1 ? 'bg-red-100 text-red-800' :
        daysUntil <= 3 ? 'bg-orange-100 text-orange-800' :
        'bg-green-100 text-green-800'
      }`}>
        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
      </span>
    </div>
  );
};

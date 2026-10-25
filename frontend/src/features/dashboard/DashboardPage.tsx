import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  ArrowRight,
  Database,
  Server,
  Plus,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { User, UserStats } from '../../types/user';
import { StatCard } from './StatCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate, getAvatarColor, getUserInitials } from '../../utils/formatters';
import { NavTab } from '../../components/layout/Sidebar';
import { Spinner } from '../../components/ui/Spinner';

interface DashboardPageProps {
  stats: UserStats | null;
  users: User[];
  loadingStats: boolean;
  loadingUsers: boolean;
  statsError: string | null;
  onRefresh: () => void;
  onNavigate: (tab: NavTab) => void;
  onOpenAddUser: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  users,
  loadingStats,
  loadingUsers,
  statsError,
  onRefresh,
  onNavigate,
  onOpenAddUser,
}) => {
  // Most recent 5 users
  const recentUsers = users.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Welcome / Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Workspace Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time analytics backed by Express REST API and MongoDB cluster.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('users')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            iconPosition="right"
          >
            Manage Users
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddUser}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Error Notice if Stats Failed */}
      {statsError && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Failed to load live statistics: {statsError}</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            icon={<RefreshCw className="w-3 h-3" />}
          >
            Retry
          </Button>
        </div>
      )}

      {/* 4 Required Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers}
          loading={loadingStats}
          icon={<Users className="w-5 h-5" />}
          description="Total registered accounts"
          accentVariant="primary"
        />

        <StatCard
          label="Active Users"
          value={stats?.activeUsers}
          loading={loadingStats}
          icon={<UserCheck className="w-5 h-5" />}
          description="Accounts with active access"
          badge={
            stats && stats.totalUsers > 0
              ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active`
              : undefined
          }
          accentVariant="success"
        />

        <StatCard
          label="Inactive Users"
          value={stats?.inactiveUsers}
          loading={loadingStats}
          icon={<UserX className="w-5 h-5" />}
          description="Suspended or dormant accounts"
          accentVariant="warning"
        />

        <StatCard
          label="Users Added This Week"
          value={stats?.usersAddedThisWeek}
          loading={loadingStats}
          icon={<UserPlus className="w-5 h-5" />}
          description="Registered within last 7 days"
          badge="Live 7d"
          accentVariant="neutral"
        />
      </div>

      {/* Two Column Layout: Recent Users & System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users Overview (2 Cols) */}
        <div className="lg:col-span-2">
          <Card
            title="Recent Users"
            description="Latest accounts registered in your database"
            action={
              <button
                onClick={() => onNavigate('users')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
              >
                View all directory <ArrowRight className="w-3 h-3" />
              </button>
            }
          >
            {loadingUsers ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Spinner size="md" />
                <span className="text-xs">Fetching real-time users...</span>
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No users found. Create your first user to populate the dashboard.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 -mx-5 -my-5">
                {recentUsers.map((user) => {
                  const avatarColor = getAvatarColor(user.name);
                  return (
                    <div
                      key={user._id}
                      className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border"
                          style={{
                            backgroundColor: avatarColor.bg,
                            color: avatarColor.text,
                            borderColor: avatarColor.border,
                          }}
                        >
                          {getUserInitials(user.name)}
                        </div>
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user.name}
                        </p>
                      </div>

                      <div className="hidden md:block text-xs text-slate-500 font-mono truncate max-w-[200px]">
                        {user.email}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:inline-block text-xs text-slate-400">
                          {formatDate(user.createdAt)}
                        </span>
                        <Badge role={user.role} size="sm" />
                        <Badge status={user.status} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* System Health & Architecture Specs (1 Col) */}
        <div className="space-y-6">
          <Card title="System Diagnostics" description="Infrastructure connectivity specs">
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-700">Express Backend</span>
                </div>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-semibold text-[11px]">
                  Online (5000)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-700">MongoDB Atlas</span>
                </div>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-semibold text-[11px]">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700">API Contract</span>
                <span className="font-mono text-slate-600">REST / JSON</span>
              </div>
            </div>
          </Card>

          <Card title="Quick Management" description="Direct actions">
            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenAddUser}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-left text-xs font-medium text-slate-700 transition-colors"
              >
                <span>Add New Member</span>
                <Plus className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-left text-xs font-medium text-slate-700 transition-colors"
              >
                <span>Customize Theme & Colors</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

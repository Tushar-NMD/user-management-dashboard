import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { AppShell } from './components/layout/AppShell';
import { NavTab } from './components/layout/Sidebar';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { UsersPage } from './features/users/UsersPage';
import { ThemeSettingsPage } from './features/theme/ThemeSettingsPage';
import { UserModal } from './features/users/UserModal';
import { Toast, ToastType } from './components/ui/Toast';
import { User, UserStats, CreateUserInput } from './types/user';
import { userService } from './services/userService';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Application Data States
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);

  // Loading & Error States
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Global Add User Modal Trigger (accessible from Dashboard, TopNav, and Users)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Global Toast Notification
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err: unknown) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      setStatsError(null);
      const data = await userService.getUserStats();
      setStats(data);
    } catch (err: unknown) {
      console.error('Failed to load stats:', err);
      const msg = err instanceof Error ? err.message : 'Error loading statistics';
      setStatsError(msg);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Combined Refresh Handler for manual clicks / mutations
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.allSettled([fetchUsers(), fetchStats()]);
    setIsRefreshing(false);
  }, [fetchUsers, fetchStats]);

  // Initial load on mount
  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const [usersRes, statsRes] = await Promise.allSettled([
          userService.getUsers(),
          userService.getUserStats(),
        ]);
        if (!active) return;
        if (usersRes.status === 'fulfilled') setUsers(usersRes.value);
        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value);
          setStatsError(null);
        } else {
          setStatsError(statsRes.reason?.message || 'Error loading statistics');
        }
      } finally {
        if (active) {
          setLoadingUsers(false);
          setLoadingStats(false);
        }
      }
    };
    void init();
    return () => {
      active = false;
    };
  }, []);

  // Global Create User Handler
  const handleCreateUser = async (data: CreateUserInput) => {
    await userService.createUser(data);
    await handleRefresh();
    showToast('success', `User ${data.name} created successfully.`);
  };

  return (
    <AppShell
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      userCount={users.length}
      onOpenAddUserModal={() => setIsAddUserModalOpen(true)}
      onRefresh={handleRefresh}
      isRefreshing={isRefreshing}
    >
      {/* Global Notification Banner */}
      {toast && (
        <div className="mb-4">
          <Toast
            type={toast.type}
            message={toast.message}
            onDismiss={() => setToast(null)}
          />
        </div>
      )}

      {currentTab === 'dashboard' && (
        <DashboardPage
          stats={stats}
          users={users}
          loadingStats={loadingStats}
          loadingUsers={loadingUsers}
          statsError={statsError}
          onRefresh={handleRefresh}
          onNavigate={setCurrentTab}
          onOpenAddUser={() => setIsAddUserModalOpen(true)}
        />
      )}

      {currentTab === 'users' && (
        <UsersPage
          users={users}
          loading={loadingUsers}
          onRefresh={handleRefresh}
          onOpenAddModal={() => setIsAddUserModalOpen(true)}
        />
      )}

      {currentTab === 'settings' && <ThemeSettingsPage />}

      {/* Global Add User Modal — Opens on ANY page including Dashboard and TopNav */}
      <UserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;

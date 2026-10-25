import React, { useState } from 'react';
import { Sidebar, NavTab } from './Sidebar';
import { TopNav } from './TopNav';

interface AppShellProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userCount?: number;
  onOpenAddUserModal?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onSelectTab,
  userCount,
  onOpenAddUserModal,
  onRefresh,
  isRefreshing,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Sidebar for desktop & drawer for mobile */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        userCount={userCount}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <TopNav
          currentTab={currentTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAddUserModal={onOpenAddUserModal}
          onSelectTab={onSelectTab}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 UserFlow Management Inc. Production Grade Architecture. Made with ❤️ by Tushar.</p>
          <div className="flex items-center gap-4">
            <span>React 19</span>
            <span>•</span>

            <span>Express & MongoDB</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

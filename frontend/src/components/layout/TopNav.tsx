import React from 'react';
import { Menu, Plus, Palette, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { NavTab } from './Sidebar';
import { useTheme } from '../../theme/useTheme';

interface TopNavProps {
  currentTab: NavTab;
  onOpenMobileMenu: () => void;
  onOpenAddUserModal?: () => void;
  onSelectTab: (tab: NavTab) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onOpenMobileMenu,
  onOpenAddUserModal,
  onSelectTab,
  onRefresh,
  isRefreshing = false,
}) => {
  const { tokens } = useTheme();

  const tabTitles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard Overview',
      subtitle: 'Real-time user analytics and database metrics',
    },
    users: {
      title: 'User Management',
      subtitle: 'Directory of registered team members and administrative access',
    },
    settings: {
      title: 'Theme Customization Engine',
      subtitle: 'Real-time presets, bespoke hex colors, and custom font uploads',
    },
  };

  const currentInfo = tabTitles[currentTab];

  return (
    <header className="sticky top-0 z-10 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              {currentInfo.title}
            </h1>
          </div>
          <p className="hidden sm:block text-xs text-slate-500 mt-0.5">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {onRefresh && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            loading={isRefreshing}
            aria-label="Refresh data"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
            className="hidden sm:inline-flex"
          >
            Refresh
          </Button>
        )}

        {currentTab !== 'settings' && (
          <button
            type="button"
            onClick={() => onSelectTab('settings')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
            title="Theme Settings"
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: tokens.primary }}
            />
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Theme</span>
          </button>
        )}

        {onOpenAddUserModal && currentTab !== 'settings' && (
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddUserModal}
            icon={<Plus className="w-4 h-4" />}
          >
            <span className="hidden xs:inline">Add</span> User
          </Button>
        )}
      </div>
    </header>
  );
};

import React from 'react';
import { LayoutDashboard, Users, Palette, CheckCircle2, X } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';

export type NavTab = 'dashboard' | 'users' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userCount,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { config, tokens } = useTheme();

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      description: 'System overview & statistics',
    },
    {
      id: 'users' as NavTab,
      label: 'Users',
      icon: <Users className="w-4 h-4" />,
      count: userCount,
      description: 'Manage accounts & roles',
    },
    {
      id: 'settings' as NavTab,
      label: 'Theme Settings',
      icon: <Palette className="w-4 h-4" />,
      description: 'Presets, colors & fonts',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm tracking-tight shadow-xs transition-colors"
            style={{
              backgroundColor: tokens.primary,
              color: tokens.primaryContrast,
            }}
          >
            UF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 tracking-tight">UserFlow</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Enterprise Core</p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </p>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left relative ${
                isActive
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: tokens.primaryLight,
                      color: tokens.primary,
                    }
                  : undefined
              }
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md"
                  style={{ backgroundColor: tokens.primary }}
                />
              )}
              <span
                style={isActive ? { color: tokens.primary } : undefined}
                className="shrink-0"
              >
                {item.icon}
              </span>
              <span className="flex-1 truncate">{item.label}</span>
              {item.count !== undefined && (
                <span
                  className="px-2 py-0.5 text-xs font-semibold rounded-full border"
                  style={
                    isActive
                      ? {
                          backgroundColor: tokens.primary,
                          color: tokens.primaryContrast,
                          borderColor: 'transparent',
                        }
                      : {
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          borderColor: '#E2E8F0',
                        }
                  }
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Theme Indicator & Server Status Footer */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        {/* Active Theme Preview Badge */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Theme Accent
            </span>
            <span className="text-[10px] font-mono font-medium text-slate-600">
              {tokens.primary}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: tokens.primary }}
            />
            <span className="text-xs font-medium text-slate-700 capitalize truncate">
              {config.customColor ? 'Custom Hex' : `${config.preset} Preset`}
            </span>
            {config.customFont && (
              <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                Custom Font
              </span>
            )}
          </div>
        </div>

        {/* Live Backend Connection Indicator */}
        <div className="flex items-center gap-2 px-1 text-xs text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="text-[11px] truncate">MongoDB & Express Live</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-xs flex-1 h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

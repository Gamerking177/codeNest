import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderCode,
  BookOpen,
  Star,
  Settings,
  ShieldAlert,
  HelpCircle,
  Keyboard,
  Plus,
  Play,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenShortcuts?: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onOpenShortcuts,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/programs', label: 'Programs', icon: FolderCode },
    { to: '/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/favorites', label: 'Favorites', icon: Star },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`flex flex-col h-full bg-dark-surface border-r border-dark-border transition-all duration-200 select-none ${
        isMobileDrawer ? 'w-64' : isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-14 px-3.5 border-b border-dark-border">
        {isCollapsed && !isMobileDrawer ? (
          <div className="mx-auto">
            <Logo iconOnly size="md" to="/dashboard" />
          </div>
        ) : (
          <Logo size="md" to="/dashboard" />
        )}

        {!isMobileDrawer && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-dark-panel transition-colors hidden md:flex"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Primary Action */}
      <div className="p-3">
        <button
          onClick={() => {
            navigate('/programs/new');
            handleLinkClick();
          }}
          className={`w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-gray-950 font-semibold text-xs py-2 px-3 rounded-lg border border-brand-400/30 transition-all shadow-subtle ${
            isCollapsed && !isMobileDrawer ? 'px-0' : ''
          }`}
          title="Create New Program"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {(!isCollapsed || isMobileDrawer) && <span>New Program</span>}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-2.5 py-1 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 px-2 py-1">
          {(!isCollapsed || isMobileDrawer) && 'Workspace'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-dark-panel'
                } ${isCollapsed && !isMobileDrawer ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {(!isCollapsed || isMobileDrawer) && <span>{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Admin Navigation (Only visible if user has admin privileges) */}
        {isAdmin && (
          <>
            <div className="pt-2 text-[10px] font-mono uppercase tracking-wider text-amber-500/80 px-2 py-1">
              {(!isCollapsed || isMobileDrawer) && 'Administration'}
            </div>
            <NavLink
              to="/admin"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-dark-panel'
                } ${isCollapsed && !isMobileDrawer ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? 'Admin' : undefined}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
              {(!isCollapsed || isMobileDrawer) && <span>Admin Console</span>}
            </NavLink>
          </>
        )}

        {/* Non-fake Feature Indicator: Quick Execute */}
        <div className="pt-3">
          <div
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-gray-500 bg-dark-panel/40 border border-dark-border/40 ${
              isCollapsed && !isMobileDrawer ? 'justify-center px-0' : ''
            }`}
            title="Quick Execute (Coming Soon - Sandboxed runner)"
          >
            <Play className="w-3.5 h-3.5 shrink-0 text-gray-500" />
            {(!isCollapsed || isMobileDrawer) && (
              <div className="flex items-center justify-between w-full">
                <span>Quick Run</span>
                <span className="text-[9px] font-mono px-1 py-0.2 bg-dark-surface rounded border border-dark-border text-gray-400">
                  Soon
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-2.5 border-t border-dark-border space-y-1">
        <NavLink
          to="/docs"
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-dark-panel transition-colors"
          title={isCollapsed ? 'Documentation' : undefined}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          {(!isCollapsed || isMobileDrawer) && <span>Documentation</span>}
        </NavLink>

        <button
          onClick={() => {
            if (onOpenShortcuts) onOpenShortcuts();
            else navigate('/shortcuts');
            handleLinkClick();
          }}
          className="w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-dark-panel transition-colors"
          title={isCollapsed ? 'Keyboard Shortcuts' : undefined}
        >
          <Keyboard className="w-4 h-4 shrink-0" />
          {(!isCollapsed || isMobileDrawer) && (
            <div className="flex items-center justify-between w-full">
              <span>Shortcuts</span>
              <span className="font-mono text-[10px] text-gray-500 bg-dark-panel px-1.5 py-0.5 rounded border border-dark-border">
                Ctrl+K
              </span>
            </div>
          )}
        </button>

        {/* User Mini Profile */}
        <div className="pt-2 border-t border-dark-border flex items-center justify-between gap-2 px-1">
          <div
            onClick={() => {
              navigate('/profile');
              handleLinkClick();
            }}
            className={`flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ${
              isCollapsed && !isMobileDrawer ? 'justify-center w-full' : ''
            }`}
            title={user?.email}
          >
            <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
            </div>
            {(!isCollapsed || isMobileDrawer) && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-gray-200 truncate">
                  {user?.name || 'Student'}
                </span>
                <span className="text-[10px] font-mono text-gray-500 truncate">
                  {user?.role || 'USER'}
                </span>
              </div>
            )}
          </div>

          {(!isCollapsed || isMobileDrawer) && (
            <button
              onClick={logout}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-dark-panel rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

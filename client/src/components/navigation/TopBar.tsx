import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Laptop,
  Bell,
  User as UserIcon,
  LogOut,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface TopBarProps {
  onOpenMobileDrawer: () => void;
  onOpenCommandPalette: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileDrawer,
  onOpenCommandPalette,
}) => {
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Generate readable breadcrumbs from path
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const formatBreadcrumb = (segment: string) => {
    if (segment === 'programs') return 'Programs';
    if (segment === 'subjects') return 'Subjects';
    if (segment === 'favorites') return 'Favorites';
    if (segment === 'settings') return 'Settings';
    if (segment === 'profile') return 'Profile';
    if (segment === 'new') return 'New Program';
    if (segment === 'edit') return 'Edit';
    if (segment === 'admin') return 'Admin';
    if (segment === 'docs') return 'Documentation';
    if (segment.length > 15) return `${segment.substring(0, 8)}...`;
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <header className="h-14 bg-dark-surface/90 backdrop-blur border-b border-dark-border px-3 sm:px-4 flex items-center justify-between gap-2 z-20">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileDrawer}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-panel rounded-md md:hidden shrink-0"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb path */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 truncate">
          <Link
            to="/dashboard"
            className="hover:text-white transition-colors font-medium text-gray-300 shrink-0"
          >
            CodeNest
          </Link>

          {pathSegments.map((segment, index) => {
            const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const isLast = index === pathSegments.length - 1;

            return (
              <React.Fragment key={url}>
                <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                {isLast ? (
                  <span className="font-semibold text-gray-100 truncate">
                    {formatBreadcrumb(segment)}
                  </span>
                ) : (
                  <Link to={url} className="hover:text-white transition-colors truncate">
                    {formatBreadcrumb(segment)}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: Search, Theme, Notifications, User Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Command Palette / Search Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-dark-panel border border-dark-border text-xs text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-all"
          title="Search & Commands (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <span className="hidden sm:inline">Search programs...</span>
          <kbd className="hidden sm:inline font-mono text-[10px] bg-dark-surface px-1.5 py-0.5 rounded border border-dark-border text-gray-400">
            Ctrl+K
          </kbd>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={cycleTheme}
          className="p-2 text-gray-400 hover:text-white hover:bg-dark-panel rounded-lg transition-colors border border-transparent hover:border-dark-border"
          title={`Theme: ${theme} (Click to change)`}
          aria-label="Toggle theme mode"
        >
          {theme === 'system' ? (
            <Laptop className="w-4 h-4 text-cyanAccent-500" />
          ) : resolvedTheme === 'dark' ? (
            <Moon className="w-4 h-4 text-brand-400" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-400" />
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-dark-panel transition-colors focus:ring-1 focus:ring-brand-500"
            aria-label="User profile menu"
          >
            <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
            </div>
          </button>

          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 rounded-lg bg-dark-surface border border-dark-border shadow-modal p-1.5 z-30 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-2 border-b border-dark-border mb-1">
                  <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-[11px] font-mono text-gray-400 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-dark-panel text-brand-400 border border-dark-border">
                    {user?.role || 'USER'}
                  </span>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-gray-300 hover:text-white hover:bg-dark-panel transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Your Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-gray-300 hover:text-white hover:bg-dark-panel transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Editor Settings</span>
                </Link>

                <div className="border-t border-dark-border my-1" />

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

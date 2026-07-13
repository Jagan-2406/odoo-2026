import React, { useState } from 'react';
import { Bell, Menu, Search, User } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { useRoleContext } from '../../context/RoleContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface NavbarNotification {
  id: string;
  title: string;
  category: string;
  isRead: boolean;
}

export interface NavbarProps {
  breadcrumbs: string[];
  userName: string;
  userRole: 'admin' | 'employee' | 'auditor';
  avatarUrl?: string | null;
  notifications: NavbarNotification[];
  onRoleChange: (role: 'admin' | 'employee' | 'auditor') => void;
  onNotificationClick?: (id: string) => void;
  onSearchChange?: (val: string) => void;
  onToggleSidebar?: () => void;
  onLogout?: () => void;
}

export const Navbar = ({
  breadcrumbs,
  userName,
  userRole,
  avatarUrl,
  notifications,
  onRoleChange,
  onNotificationClick,
  onSearchChange,
  onToggleSidebar,
  onLogout,
}: NavbarProps) => {
  const { profile } = useRoleContext();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="h-16 w-full flex items-center justify-between border-b border-border bg-card px-6 select-none z-40 sticky top-0">
      {/* Sidebar toggle + Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb}>
              {idx > 0 && <span className="text-zinc-600">/</span>}
              <span className={idx === breadcrumbs.length - 1 ? 'text-zinc-300' : ''}>{crumb}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="flex items-center gap-4">
        {/* Search Input Bar (Presentation only) */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search records..."
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-48 md:w-60 h-9 bg-secondary border border-border text-xs rounded-md pl-9 pr-3 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 p-0"
            onClick={() => {
              setShowNotificationMenu(!showNotificationMenu);
              setShowRoleMenu(false);
            }}
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Simple Notifications List */}
          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 rounded-md border border-border bg-card shadow-2xl z-50 overflow-hidden text-sm">
              <div className="px-4 py-2.5 border-b border-border font-semibold flex items-center justify-between text-xs uppercase tracking-wider text-zinc-400">
                <span>Alerts Log</span>
                {unreadCount > 0 && <Badge variant="error" size="sm">{unreadCount} New</Badge>}
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-zinc-500">No new alerts</div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        onNotificationClick?.(n.id);
                        setShowNotificationMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 border-b border-border/40 hover:bg-zinc-900/50 flex flex-col gap-0.5 transition-colors"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-zinc-200">{n.title}</span>
                        {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                      </div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wide">{n.category}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile / Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotificationMenu(false);
            }}
            className="flex items-center gap-2 hover:opacity-85 focus-visible:outline-none"
            aria-label="User Options Menu"
          >
            <Avatar name={userName} src={avatarUrl} size="sm" />
            <div className="hidden md:flex flex-col items-start leading-none text-left">
              <span className="text-xs font-semibold text-zinc-200">{userName}</span>
              <span className="text-[10px] text-zinc-500 capitalize">{userRole} role</span>
            </div>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card shadow-2xl z-50 overflow-hidden text-sm">
              {profile?.role === 'admin' && (
                <>
                  <div className="px-4 py-2 border-b border-border font-medium text-xs text-zinc-500">
                    Switch Platform Role
                  </div>
                  <div className="p-1 flex flex-col gap-0.5 border-b border-border/60">
                    {(['admin', 'employee', 'auditor'] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          onRoleChange(role);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-xs capitalize transition-colors ${
                          userRole === role
                            ? 'bg-zinc-900 text-emerald-400 font-semibold'
                            : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                        }`}
                      >
                        {role} View
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className="p-1">
                <button
                  onClick={() => {
                    onLogout?.();
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded text-xs text-red-400 hover:bg-red-500/10 transition-colors font-medium font-mono"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

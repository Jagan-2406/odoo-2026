import React, { useState } from 'react';
import { Sidebar, SidebarNavItem } from '../navigation/Sidebar';
import { Navbar, NavbarNotification } from '../navigation/Navbar';

// ==========================================
// 1. Page Layout Container Wrapper
// ==========================================
export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className = '' }: PageContainerProps) => {
  return (
    <main className={`flex-1 p-6 md:p-8 overflow-y-auto ${className}`}>
      <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">{children}</div>
    </main>
  );
};

// ==========================================
// 2. Page Header Widget
// ==========================================
export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight display-font text-zinc-50">{title}</h2>
        {description && <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
};

// ==========================================
// 3. Shell AppLayout wrapper
// ==========================================
export interface AppLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarNavItem[];
  activePath: string;
  onNavigate: (path: string) => void;
  userName: string;
  userRole: 'admin' | 'employee' | 'auditor';
  onRoleChange: (role: 'admin' | 'employee' | 'auditor') => void;
  notifications: NavbarNotification[];
  breadcrumbs: string[];
  avatarUrl?: string | null;
  onLogout?: () => void;
}

export const AppLayout = ({
  children,
  sidebarItems,
  activePath,
  onNavigate,
  userName,
  userRole,
  onRoleChange,
  notifications,
  breadcrumbs,
  avatarUrl,
  onLogout,
}: AppLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop Sidebar (visible on medium & above) */}
      <Sidebar
        items={sidebarItems}
        activePath={activePath}
        onNavigate={onNavigate}
        collapsed={collapsed}
        className="hidden md:flex flex-shrink-0"
      />

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <Sidebar
            items={sidebarItems}
            activePath={activePath}
            onNavigate={(path) => {
              onNavigate(path);
              setMobileOpen(false);
            }}
            collapsed={false}
            className="relative z-10 w-60 h-full flex"
          />
        </div>
      )}

      {/* Viewport Frame */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Navbar
          breadcrumbs={breadcrumbs}
          userName={userName}
          userRole={userRole}
          avatarUrl={avatarUrl}
          notifications={notifications}
          onRoleChange={onRoleChange}
          onToggleSidebar={() => setMobileOpen(!mobileOpen)}
          onSearchChange={(val) => console.log('Searching:', val)}
          onLogout={onLogout}
        />
        {/* Toggle bar for desktop collapse (ambient floating trigger) */}
        <div className="hidden md:flex justify-end px-6 py-1 border-b border-border bg-zinc-950/20">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300"
          >
            {collapsed ? '→ Expand sidebar' : '← Collapse sidebar'}
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

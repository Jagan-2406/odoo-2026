import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Shield } from 'lucide-react';

export interface SidebarNavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SidebarNavItem[];
  activePath: string;
  onNavigate: (path: string) => void;
  collapsed?: boolean;
}

export const Sidebar = ({
  className,
  items,
  activePath,
  onNavigate,
  collapsed = false,
  ...props
}: SidebarProps) => {
  return (
    <aside
      className={twMerge(
        'h-screen flex flex-col bg-zinc-950 border-r border-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-60',
        className
      )}
      {...props}
    >
      {/* Brand logo header */}
      <div className="flex h-16 items-center px-4 border-b border-border gap-2 overflow-hidden select-none">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 text-emerald-400">
          <Shield className="h-5 w-5" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold tracking-wider text-zinc-50 display-font uppercase">
            EcoSphere
          </span>
        )}
      </div>

      {/* Navigation menu list */}
      <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
        {items.map((item) => {
          const isActive = activePath === item.path;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.path)}
              className={clsx(
                'w-full flex items-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring py-2.5',
                collapsed ? 'justify-center px-0' : 'px-3 gap-3',
                isActive
                  ? 'bg-zinc-900 text-emerald-400 border-l-2 border-emerald-500 rounded-l-none'
                  : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100'
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className={clsx('flex-shrink-0', isActive ? 'text-emerald-400' : 'text-zinc-500')}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'info' | 'environmental' | 'social' | 'governance';
  size?: 'sm' | 'md';
}

export const Badge = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) => {
  const baseStyles =
    'inline-flex items-center font-medium rounded-full tracking-wider uppercase';

  const variants = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-border text-foreground',
    success: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    error: 'bg-red-500/10 text-red-500 border border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    environmental: 'bg-emerald-500/15 text-emerald-400 dark:text-emerald-300 border border-emerald-500/30',
    social: 'bg-violet-500/15 text-violet-400 dark:text-violet-300 border border-violet-500/30',
    governance: 'bg-amber-500/15 text-amber-400 dark:text-amber-300 border border-amber-500/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  const classes = twMerge(clsx(baseStyles, variants[variant], sizes[size], className));

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

/**
 * Usage Example:
 * <Badge variant="environmental">Carbon Log</Badge>
 */

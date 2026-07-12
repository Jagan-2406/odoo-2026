import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  variant?: 'default' | 'environmental' | 'social' | 'governance';
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const Progress = ({
  className,
  value,
  variant = 'default',
  height = 'md',
  showLabel = false,
  ...props
}: ProgressProps) => {
  const boundedValue = Math.min(Math.max(value, 0), 100);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    default: 'bg-primary',
    environmental: 'bg-emerald-500 dark:bg-emerald-400',
    social: 'bg-violet-500 dark:bg-violet-400',
    governance: 'bg-amber-500 dark:bg-amber-400',
  };

  return (
    <div className={twMerge('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(boundedValue)}%</span>
        </div>
      )}
      <div className={twMerge('w-full bg-secondary rounded-full overflow-hidden', heightClasses[height])}>
        <motion.div
          className={twMerge('h-full rounded-full', variants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${boundedValue}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          role="progressbar"
          aria-valuenow={boundedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

/**
 * Usage Example:
 * <Progress value={75} variant="environmental" showLabel={true} />
 */

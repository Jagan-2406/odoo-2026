import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Progress } from '../common/Progress';

// ==========================================
// 1. Stat Card (Dashboard Metrics / Trends)
// ==========================================
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number; // percentage
    type: 'positive' | 'negative' | 'neutral';
  };
  subtext?: string;
}

export const StatCard = ({
  className,
  title,
  value,
  icon,
  trend,
  subtext,
  ...props
}: StatCardProps) => {
  return (
    <div
      className={twMerge(
        'p-6 bg-card border border-border rounded-lg shadow-sm flex flex-col justify-between min-h-[140px]',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="flex flex-col gap-1 mt-4">
        <span className="text-3xl font-bold tracking-tight display-font text-foreground">{value}</span>
        <div className="flex items-center gap-1.5 min-h-[20px]">
          {trend && (
            <span
              className={clsx(
                'inline-flex items-center text-xs font-medium',
                trend.type === 'positive' && 'text-emerald-500',
                trend.type === 'negative' && 'text-red-500',
                trend.type === 'neutral' && 'text-zinc-500'
              )}
            >
              {trend.type === 'positive' ? (
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              ) : trend.type === 'negative' ? (
                <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
              ) : null}
              {trend.value}%
            </span>
          )}
          {subtext && <span className="text-xs text-zinc-500">{subtext}</span>}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. Metric Progress Card (Goals tracking)
// ==========================================
export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  variant?: 'default' | 'environmental' | 'social' | 'governance';
}

export const MetricCard = ({
  className,
  title,
  currentValue,
  targetValue,
  unit,
  variant = 'default',
  ...props
}: MetricCardProps) => {
  const percentage = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;

  return (
    <div className={twMerge('p-6 bg-card border border-border rounded-lg shadow-sm', className)} {...props}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-semibold tracking-tight text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground font-medium">
          {currentValue.toLocaleString()} / {targetValue.toLocaleString()} {unit}
        </span>
      </div>
      <Progress value={percentage} variant={variant} className="mt-4" />
      <div className="flex justify-between items-center mt-2.5 text-xs text-zinc-500 font-medium">
        <span>Completion</span>
        <span>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

// ==========================================
// 3. Overall Weighted ESG Score Card
// ==========================================
export interface ESGScoreCardProps extends React.HTMLAttributes<HTMLDivElement> {
  overallScore: number;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  weights: {
    environmental: number;
    social: number;
    governance: number;
  };
}

export const ESGScoreCard = ({
  className,
  overallScore,
  environmentalScore,
  socialScore,
  governanceScore,
  weights,
  ...props
}: ESGScoreCardProps) => {
  const subscores = [
    { name: 'Environmental', value: environmentalScore, weight: weights.environmental, color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'Social', value: socialScore, weight: weights.social, color: 'text-violet-400 bg-violet-500/10' },
    { name: 'Governance', value: governanceScore, weight: weights.governance, color: 'text-amber-400 bg-amber-500/10' },
  ];

  return (
    <div
      className={twMerge(
        'p-6 bg-card border border-border rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center',
        className
      )}
      {...props}
    >
      {/* Big Score Callout */}
      <div className="flex flex-col items-center md:items-start md:border-r border-border md:pr-6 justify-center text-center md:text-left min-h-[140px]">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Overall ESG Rating</span>
        <span className="text-5xl font-extrabold text-foreground mt-2 display-font tracking-tighter">
          {overallScore.toFixed(1)}
        </span>
        <span className="text-xs text-emerald-500 font-medium mt-1">Excellent Standing</span>
      </div>

      {/* Breakdown scores */}
      <div className="col-span-2 flex flex-col gap-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Pillar Scores (Weighted)</h4>
        <div className="flex flex-col gap-3">
          {subscores.map((sub) => (
            <div key={sub.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={clsx('h-2 w-2 rounded-full', sub.name === 'Environmental' ? 'bg-emerald-500' : sub.name === 'Social' ? 'bg-violet-500' : 'bg-amber-500')} />
                <span className="font-medium text-zinc-300">{sub.name}</span>
                <span className="text-xs text-zinc-500">({(sub.weight * 100).toFixed(0)}%)</span>
              </div>
              <span className="font-bold text-foreground">{sub.value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Trophy, Medal, Star } from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { Employee } from '../../../models/employee';

export interface LeaderboardWidgetProps {
  employees?: Employee[];
  isLoading?: boolean;
  isError?: boolean;
}

export const LeaderboardWidget = ({
  employees = [],
  isLoading = false,
  isError = false,
}: LeaderboardWidgetProps) => {
  if (isError) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg min-h-[280px] flex items-center justify-center text-xs text-red-400">
        Unable to load employee leaderboard
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg min-h-[280px] space-y-4">
        <div className="h-4 bg-zinc-800 rounded w-1/3 animate-pulse" />
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 animate-pulse">
            <div className="h-8 w-8 rounded-full bg-zinc-800" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-zinc-800 rounded w-1/2" />
              <div className="h-2.5 bg-zinc-800 rounded w-1/3" />
            </div>
            <div className="h-4 w-12 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Slice top 5 for preview
  const topFive = employees.slice(0, 5);

  return (
    <div className="p-6 bg-card border border-border rounded-lg flex flex-col justify-between min-h-[280px] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Trophy className="h-4.5 w-4.5 text-amber-400" /> Top Performers Leaderboard
        </h3>
        <span className="text-[10px] text-zinc-500 font-semibold uppercase">Global XP</span>
      </div>

      <div className="divide-y divide-border/40 flex-1 flex flex-col justify-around">
        {topFive.map((emp, index) => (
          <div key={emp.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-500 w-4">
                {index === 0 ? (
                  <Medal className="h-4 w-4 text-amber-400" />
                ) : index === 1 ? (
                  <Medal className="h-4 w-4 text-zinc-400" />
                ) : index === 2 ? (
                  <Medal className="h-4 w-4 text-amber-600" />
                ) : (
                  index + 1
                )}
              </span>
              <Avatar name={emp.name} src={emp.avatarUrl} size="sm" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200">{emp.name}</span>
                <span className="text-[9px] text-zinc-500 font-medium uppercase tracking-wide">
                  {emp.role}
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 font-mono">
              <Star className="h-3 w-3 fill-indigo-400/20" /> {emp.xp.toLocaleString()} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

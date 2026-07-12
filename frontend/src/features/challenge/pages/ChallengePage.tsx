import React from 'react';
import { PageContainer, PageHeader } from '../../../components/layout/AppLayout';
import { Button } from '../../../components/common/Button';
import { Trophy } from 'lucide-react';

export const ChallengePage = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Eco Challenges"
        description="Join company-wide gamified campaigns, earn XP, and level up your ESG footprint."
      />

      {/* Grid items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="p-6 bg-card border border-border rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-semibold text-zinc-100">Zero-Waste Challenge Week</h4>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Difficulty: Medium
                </span>
              </div>
              <span className="text-sm font-bold text-indigo-400 font-mono">+400 XP</span>
            </div>
            <p className="text-xs text-zinc-400">
              Log daily items showing zero single-use plastic waste for seven consecutive days.
            </p>
            <div className="flex justify-between items-center pt-2 text-xs">
              <span className="text-zinc-500">Ends in 5 days</span>
              <Button variant="outline" size="sm">Accept Challenge</Button>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};
export default ChallengePage;

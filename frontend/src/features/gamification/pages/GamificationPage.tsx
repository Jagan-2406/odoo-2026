import React from 'react';
import { PageContainer, PageHeader } from '../../../components/layout/AppLayout';
import { Button } from '../../../components/common/Button';
import { Award, ShoppingBag } from 'lucide-react';

export const GamificationPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Rewards Catalog & Badges"
        description="Redeem points for sustainable merchandise and showcase your earned badges."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rewards Store */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="h-4.5 w-4.5 text-zinc-500" /> Reward Catalog
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="p-4 bg-card border border-border rounded-lg flex flex-col justify-between min-h-[160px]">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-zinc-200">Organic Coffee Tumbler</h4>
                  <p className="text-xs text-zinc-400">Reusable double-walled bamboo mug.</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-bold text-amber-400 font-mono">350 Points</span>
                  <Button variant="outline" size="sm">Redeem</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges unlocked */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-zinc-500" /> Achievements
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 text-center">
                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-emerald-400 border border-border">
                  🌿
                </div>
                <span className="text-[10px] text-zinc-400 truncate w-full">Badge #{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
export default GamificationPage;

import React, { useState } from 'react';
import { PageContainer, PageHeader } from '../../../components/layout/AppLayout';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Award, ShoppingBag, Coins, AlertCircle, CheckCircle } from 'lucide-react';
import { useRewards, useBadges, useRedeemReward } from '../hooks/useGamification';
import { useRoleContext } from '../../../context/RoleContext';
import { useEmployees } from '../../dashboard/hooks/useDashboard';

export const GamificationPage = () => {
  const { role } = useRoleContext();
  const { data: employees = [] } = useEmployees();
  
  // Resolve current active employee
  const currentEmployee = employees.find(e => 
    role === 'admin' ? e.email.includes('nova') :
    role === 'auditor' ? e.email.includes('jagan') :
    e.email.includes('komal')
  );

  const { data: rewards = [], isLoading: isRewardsLoading } = useRewards();
  const { data: badges = [], isLoading: isBadgesLoading } = useBadges(currentEmployee?.id);
  const redeemMutation = useRedeemReward();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRedeem = (rewardId: string, rewardName: string) => {
    if (!currentEmployee) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    redeemMutation.mutate(
      { rewardId, employeeId: currentEmployee.id },
      {
        onSuccess: () => {
          setSuccessMessage(`Successfully redeemed 1x ${rewardName}!`);
        },
        onError: (err: any) => {
          setErrorMessage(err.message || 'Redemption failed. Check your XP balance.');
        },
      }
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="Rewards Catalog & Badges"
        description="Redeem points for sustainable merchandise and showcase your earned badges."
        action={
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-400 font-bold font-mono text-xs">
            <Coins className="h-4 w-4" />
            <span>Balance: {currentEmployee?.points || 0} XP</span>
          </div>
        }
      />

      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-3 text-xs">
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-3 text-xs">
          <AlertCircle className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rewards Store */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="h-4.5 w-4.5 text-zinc-500" /> Reward Catalog
          </h3>

          {isRewardsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-40 bg-zinc-900 border border-border rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewards.map((reward) => {
                const isOutOfStock = reward.stock <= 0;

                return (
                  <div key={reward.id} className="p-4 bg-card border border-border rounded-lg flex flex-col justify-between min-h-[160px]">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-zinc-200">{reward.name}</h4>
                        <span className="text-[10px] text-zinc-500 font-mono">Stock: {reward.stock}</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{reward.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs font-bold text-amber-400 font-mono">{reward.pointsRequired} XP</span>
                      <Button
                        variant={isOutOfStock ? 'ghost' : 'outline'}
                        size="sm"
                        disabled={isOutOfStock || redeemMutation.isPending}
                        onClick={() => handleRedeem(reward.id, reward.name)}
                      >
                        {isOutOfStock ? 'Out of Stock' : 'Redeem'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Badges unlocked */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4 h-fit">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-zinc-500" /> Achievements
          </h3>

          {isBadgesLoading ? (
            <div className="grid grid-cols-3 gap-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 w-16 bg-zinc-900 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {badges.map((badge) => {
                const isUnlocked = !!badge.unlockedAt;

                return (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center gap-1.5 text-center transition-all ${
                      isUnlocked ? 'opacity-100 scale-100' : 'opacity-35 scale-95 filter grayscale'
                    }`}
                  >
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center text-xl border ${
                        isUnlocked
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-md shadow-emerald-500/5'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}
                      title={isUnlocked ? `Unlocked on ${badge.unlockedAt?.toLocaleDateString()}` : badge.unlockRule}
                    >
                      {badge.icon || '🏆'}
                    </div>
                    <span className="text-[9px] font-medium text-zinc-300 truncate w-full" title={badge.name}>
                      {badge.name}
                    </span>
                    {!isUnlocked && (
                      <span className="text-[7px] text-zinc-500 font-mono block">
                        {badge.unlockRule.split(' ')[1]} XP
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default GamificationPage;

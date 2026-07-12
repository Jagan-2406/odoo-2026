import React from 'react';
import { PageContainer, PageHeader } from '../../../components/layout/AppLayout';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { CheckCircle } from 'lucide-react';
import { useChallenges, useChallengeParticipations, useSubmitChallengeProgress } from '../hooks/useChallenges';
import { useRoleContext } from '../../../context/RoleContext';
import { useEmployees } from '../../dashboard/hooks/useDashboard';

export const ChallengePage = () => {
  const { role } = useRoleContext();
  const { data: employees = [] } = useEmployees();
  const { data: challenges = [], isLoading: isChallengesLoading } = useChallenges();
  
  // Resolve current active employee
  const currentEmployee = employees.find(e => 
    role === 'admin' ? e.email.includes('nova') :
    role === 'auditor' ? e.email.includes('jagan') :
    e.email.includes('komal')
  );

  const { data: participations = [], isLoading: isPartsLoading } = useChallengeParticipations(currentEmployee?.id);
  const submitProgressMutation = useSubmitChallengeProgress();

  const handleAccept = (challengeId: string) => {
    if (!currentEmployee) return;
    submitProgressMutation.mutate({
      challengeId,
      employeeId: currentEmployee.id,
      progress: 10,
      proofFile: null,
    });
  };

  const handleComplete = (challengeId: string) => {
    if (!currentEmployee) return;
    submitProgressMutation.mutate({
      challengeId,
      employeeId: currentEmployee.id,
      progress: 100,
      proofFile: null,
    });
  };

  const getParticipation = (challengeId: string) => {
    return participations.find(p => p.challengeId === challengeId);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Eco Challenges"
        description="Join company-wide gamified campaigns, earn XP, and level up your ESG footprint."
      />

      {isChallengesLoading || isPartsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-44 bg-zinc-900 border border-border rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => {
            const part = getParticipation(challenge.id);
            const isCompleted = part?.progress === 100;
            const isInProgress = part && part.progress < 100;

            return (
              <div key={challenge.id} className="p-6 bg-card border border-border rounded-lg flex flex-col justify-between min-h-[180px]">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-semibold text-zinc-100">{challenge.title}</h4>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded mt-1 inline-block">
                        Difficulty: {challenge.difficulty || 'Medium'}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-indigo-400 font-mono">+{challenge.xp} XP</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-border/40 text-xs mt-4">
                  <span className="text-zinc-500">
                    Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                  </span>
                  {isCompleted ? (
                    <Badge variant="success">
                      <CheckCircle className="h-3 w-3 inline-block mr-1" /> Completed
                    </Badge>
                  ) : isInProgress ? (
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-amber-400 font-semibold font-mono">In Progress</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleComplete(challenge.id)}
                        disabled={submitProgressMutation.isPending}
                      >
                        Complete
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAccept(challenge.id)}
                      disabled={submitProgressMutation.isPending}
                    >
                      Accept Challenge
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
};

export default ChallengePage;

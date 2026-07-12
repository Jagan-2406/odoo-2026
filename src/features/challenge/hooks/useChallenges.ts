import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '../../../services';
import { queryKeys } from '../../../services/queryKeys';

/**
 * Hook to retrieve challenges lists.
 */
export const useChallenges = (filters?: { status?: string }) => {
  return useQuery({
    queryKey: [...queryKeys.challenges, filters],
    queryFn: () => services.challenge.getChallenges(filters),
  });
};

/**
 * Hook to query challenge participations for progress boards.
 */
export const useChallengeParticipations = (employeeId?: string) => {
  return useQuery({
    queryKey: [...queryKeys.challenges, 'participations', employeeId],
    queryFn: () =>
      employeeId
        ? services.challenge.getParticipationsByEmployeeId(employeeId)
        : services.challenge.getAllParticipations(),
  });
};

/**
 * Mutation hook to submit progress updates.
 */
export const useSubmitChallengeProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ challengeId, employeeId, progress, proofFile }: { challengeId: string; employeeId: string; progress: number; proofFile: File | null }) =>
      services.challenge.submitChallengeProgress(challengeId, employeeId, progress, proofFile),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.challenges, 'participations'] });
    },
  });
};

/**
 * Mutation hook to approve challenge achievements.
 */
export const useApproveChallengeParticipation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) =>
      services.challenge.approveChallengeParticipation(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.challenges, 'participations'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};
export type UseApproveChallengeParticipationReturn = ReturnType<typeof useApproveChallengeParticipation>;
